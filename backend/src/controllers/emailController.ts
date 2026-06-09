import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import Email from '../models/Email';
import OpenEvent from '../models/OpenEvent';
import ClickEvent from '../models/ClickEvent';
import config from '../config';
import { buildTrackedHtml, deriveStatus } from '../utils/emailHelpers';

const useDevTransport =
  process.env.SKIP_SMTP === 'true' ||
  !config.emailUser ||
  config.emailUser.includes('example@');

// Global fallback transporter (dev)
const fallbackTransporter = useDevTransport
  ? nodemailer.createTransport({ jsonTransport: true })
  : nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

import User from '../models/User';

export const createTransporterForUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (user && user.smtpEmail && user.smtpPassword) {
    return {
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: user.smtpEmail,
          pass: user.smtpPassword,
        },
      }),
      fromEmail: user.smtpEmail,
      isReal: true,
    };
  }
  return { transporter: fallbackTransporter, fromEmail: config.emailUser || 'mailtrack@localhost', isReal: false };
};

async function enrichEmail(email: any) {
  const [opens, clicks] = await Promise.all([
    OpenEvent.countDocuments({ emailId: email._id }),
    ClickEvent.countDocuments({ emailId: email._id }),
  ]);

  return {
    id: email._id.toString(),
    recipient: email.recipient,
    recipientName: email.recipient.split('@')[0].replace(/[._]/g, ' '),
    subject: email.subject,
    sentDate: email.sentAt,
    status: deriveStatus(opens, clicks),
    opens,
    clicks,
    preview: email.content.slice(0, 120),
    trackingId: email.trackingId,
  };
}

export const listEmails = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { search, status, page = '1', limit = '20' } = req.query;
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

    if (status && status !== 'all') {
      enriched = enriched.filter((e) => e.status === status);
    }

    const total = enriched.length;
    const start = (pageNum - 1) * limitNum;
    const items = enriched.slice(start, start + limitNum);

    res.json({ items, total, page: pageNum, totalPages: Math.max(1, Math.ceil(total / limitNum)) });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getEmailById = async (req: any, res: Response) => {
  try {
    const email = await Email.findOne({ _id: req.params.id, userId: req.user.id });
    if (!email) return res.status(404).json({ msg: 'Email not found' });
    res.json(await enrichEmail(email));
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const sendEmail = async (req: any, res: Response) => {
  const { recipient, cc, bcc, subject, content, scheduleAt } = req.body;
  const userId = req.user.id;

  if (!recipient || !subject || !content) {
    return res.status(400).json({ msg: 'Recipient, subject, and content are required' });
  }

  // Parse cc and bcc (comma‑separated) into arrays, filter empty strings
  const parseList = (list?: string) =>
    (list || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
  const ccList = parseList(cc);
  const bccList = parseList(bcc);

  // Validate email addresses
  const { isEmail } = require('validator');
  const allAddresses = [recipient, ...ccList, ...bccList];
  for (const addr of allAddresses) {
    if (!isEmail(addr)) {
      return res.status(400).json({ msg: `Invalid email address: ${addr}` });
    }
  }

  // Determine if we need to schedule
  const scheduleDate = scheduleAt ? new Date(scheduleAt) : null;
  if (scheduleDate && scheduleDate <= new Date()) {
    return res.status(400).json({ msg: 'scheduleAt must be a future datetime' });
  }

  try {
    const trackingId = uuidv4();
    const htmlContent = buildTrackedHtml(content, trackingId, config.backendUrl);

    // If scheduling, we store with status pending and let scheduler send later
    const emailStatus = scheduleDate ? 'pending' : 'sent';

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

    const { transporter: userTransporter, fromEmail, isReal } = await createTransporterForUser(userId);

    if (!scheduleDate) {
      // Immediate send
      await userTransporter.sendMail({
        from: fromEmail,
        to: recipient,
        cc: ccList.length ? ccList : undefined,
        bcc: bccList.length ? bccList : undefined,
        subject,
        html: htmlContent,
      });
    } else {
      // Register with scheduler (will send later)
      const { scheduleEmail } = require('../services/scheduler');
      scheduleEmail(email);
    }

    if (!isReal) {
      console.log(`[dev] Email saved (SMTP ${scheduleDate ? 'scheduled' : 'skipped'}). Open pixel: ${config.backendUrl}/api/track/open/${trackingId}`);
    }

    res.json({
      msg: scheduleDate ? 'Email scheduled successfully' : 'Email sent successfully',
      emailId: email._id.toString(),
      trackingId,
      previewUrl: `${config.backendUrl}/api/track/open/${trackingId}`,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to process email', error: err.message });
  }
};
