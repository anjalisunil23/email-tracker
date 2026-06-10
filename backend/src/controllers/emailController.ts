import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

import Email from "../models/Email";

import OpenEvent from "../models/OpenEvent";

import ClickEvent from "../models/ClickEvent";

import config from "../config";

import { buildTrackedHtml, htmlToPlainText, resolveEmailStatus } from "../utils/emailHelpers";

import { formatFromAddress, getTransporterForUser } from "../utils/mailTransport";

function smtpErrorMessage(err: any): string {
  const code = err?.code || "";

  if (code === "EAUTH") {
    return "Gmail authentication failed. Use a Google App Password (2FA must be enabled on the Gmail account).";
  }

  if (code === "ECONNECTION" || code === "ETIMEDOUT") {
    return "Could not connect to Gmail SMTP. Check your network and firewall.";
  }

  if (code === "EENVELOPE") {
    return `Invalid recipient or sender address: ${err.message}`;
  }

  return err?.message || "Unknown SMTP error";
}

function isLocalBackend(url: string) {
  return url.includes("localhost") || url.includes("127.0.0.1");
}

async function enrichEmail(email: any) {
  const [opens, clicks] = await Promise.all([
    OpenEvent.countDocuments({ emailId: email._id }),

    ClickEvent.countDocuments({ emailId: email._id }),
  ]);

  return {
    id: email._id.toString(),

    recipient: email.recipient,

    recipientName: email.recipient.split("@")[0].replace(/[._]/g, " "),

    subject: email.subject,

    sentDate: email.sentAt,

    status: resolveEmailStatus(email.status, opens, clicks),

    deliveryStatus: email.status,

    scheduleAt: email.scheduleAt,

    opens,

    clicks,

    preview: email.content.slice(0, 120),

    trackingId: email.trackingId,
  };
}

export const createTransporterForUser = getTransporterForUser;

export const listEmails = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const { search, status, page = "1", limit = "20" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);

    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 20));

    const emails = await Email.find({ userId }).sort({ sentAt: -1 });

    let enriched = await Promise.all(emails.map(enrichEmail));

    if (search) {
      const q = (search as string).toLowerCase();

      enriched = enriched.filter(
        (e) =>
          e.recipient.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.recipientName.toLowerCase().includes(q),
      );
    }

    if (status && status !== "all") {
      enriched = enriched.filter((e) => e.status === status);
    }

    const total = enriched.length;

    const start = (pageNum - 1) * limitNum;

    const items = enriched.slice(start, start + limitNum);

    res.json({ items, total, page: pageNum, totalPages: Math.max(1, Math.ceil(total / limitNum)) });
  } catch (err: any) {
    console.error(err.message);

    res.status(500).send("Server error");
  }
};

export const getScheduledEmails = async (req: any, res: Response) => {
  try {
    const emails = await Email.find({ userId: req.user.id, status: "pending" }).sort({
      scheduleAt: 1,
    });

    const items = await Promise.all(emails.map(enrichEmail));

    res.json(items);
  } catch (err: any) {
    console.error(err.message);

    res.status(500).send("Server error");
  }
};

export const cancelScheduledEmail = async (req: any, res: Response) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: "pending",
    });

    if (!email) return res.status(404).json({ msg: "Scheduled email not found" });

    await email.deleteOne();

    res.json({ msg: "Scheduled email cancelled" });
  } catch (err: any) {
    console.error(err.message);

    res.status(500).send("Server error");
  }
};

export const getEmailById = async (req: any, res: Response) => {
  try {
    const email = await Email.findOne({ _id: req.params.id, userId: req.user.id });

    if (!email) return res.status(404).json({ msg: "Email not found" });

    res.json(await enrichEmail(email));
  } catch (err: any) {
    console.error(err.message);

    res.status(500).send("Server error");
  }
};

export const sendEmail = async (req: any, res: Response) => {
  const { recipient, cc, bcc, subject, content, scheduleAt } = req.body;

  const userId = req.user.id;

  if (!recipient || !subject || !content) {
    return res.status(400).json({ msg: "Recipient, subject, and content are required" });
  }

  const parseList = (list?: string) =>
    (list || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

  const ccList = parseList(cc);

  const bccList = parseList(bcc);

  const { isEmail } = require("validator");

  const allAddresses = [recipient, ...ccList, ...bccList];

  for (const addr of allAddresses) {
    if (!isEmail(addr)) {
      return res.status(400).json({ msg: `Invalid email address: ${addr}` });
    }
  }

  const scheduleDate = scheduleAt ? new Date(scheduleAt) : null;

  if (scheduleDate && scheduleDate <= new Date()) {
    return res.status(400).json({ msg: "scheduleAt must be a future datetime" });
  }

  const backendUrl = config.backendUrl;

  const trackingLocal = isLocalBackend(backendUrl);

  try {
    const trackingId = uuidv4();

    const htmlContent = buildTrackedHtml(content, trackingId, backendUrl);

    const textContent = htmlToPlainText(content);

    const emailStatus = scheduleDate ? "pending" : "sent";

    const email = new Email({
      userId,

      recipient,

      cc: ccList,

      bcc: bccList,

      subject,

      content,

      trackingId,

      scheduleAt: scheduleDate,

      status: emailStatus,
    });

    await email.save();

    const { transporter, fromEmail, fromName, isReal } = await getTransporterForUser(userId);

    if (!scheduleDate) {
      if (!isReal) {
        email.status = "failed";

        await email.save();

        return res.status(502).json({
          msg: "SMTP is disabled. Set SKIP_SMTP=false and configure EMAIL_USER/EMAIL_PASS in backend/.env",

          emailId: email._id.toString(),
        });
      }

      try {
        const result = await transporter.sendMail({
          from: formatFromAddress(fromEmail, fromName),

          to: recipient,

          cc: ccList.length ? ccList : undefined,

          bcc: bccList.length ? bccList : undefined,

          replyTo: fromEmail,

          subject,

          text: textContent,

          html: htmlContent,

          headers: {
            "X-Mailer": "Mail-Tracker",
          },
        });

        console.log(`[SMTP] Delivered to ${recipient}: ${result.messageId}`);
      } catch (smtpErr: any) {
        console.error("SMTP send failed:", smtpErr.message, smtpErr.response || "");

        email.status = "failed";

        await email.save();

        return res.status(502).json({
          msg: "Email could not be delivered via Gmail",

          error: smtpErrorMessage(smtpErr),

          emailId: email._id.toString(),

          trackingId,
        });
      }
    } else {
      const { scheduleEmail } = require("../services/scheduler");

      scheduleEmail(email);
    }

    res.json({
      msg: scheduleDate ? "Email scheduled successfully" : "Email sent successfully via Gmail",

      emailId: email._id.toString(),

      trackingId,

      smtpReal: isReal,

      trackingUrl: backendUrl,

      trackingLocal,

      trackingWarning: trackingLocal
        ? "Tracking uses localhost — Gmail cannot load open/click pixels. Restart backend with USE_TRACKING_TUNNEL=true or set a public BACKEND_URL."
        : undefined,

      previewUrl: `${backendUrl}/api/track/open/${trackingId}`,
    });
  } catch (err: any) {
    console.error(err.message);

    res.status(500).json({ msg: "Failed to process email", error: err.message });
  }
};
