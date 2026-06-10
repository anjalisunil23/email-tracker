import { Response } from "express";
import Email from "../models/Email";
import OpenEvent from "../models/OpenEvent";
import ClickEvent from "../models/ClickEvent";
import { resolveEmailStatus } from "../utils/emailHelpers";
import config from "../config";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DEVICE_COLORS: Record<string, string> = {
  Desktop: "var(--color-chart-1)",
  Mobile: "var(--color-chart-2)",
  Tablet: "var(--color-chart-3)",
};

async function getUserEmailIds(userId: string) {
  const emails = await Email.find({ userId });
  return { emails, emailIds: emails.map((e) => e._id) };
}

export const getSummary = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { emails, emailIds } = await getUserEmailIds(userId);
    const totalEmails = emails.length;

    const [totalOpens, totalClicks] = await Promise.all([
      OpenEvent.countDocuments({ emailId: { $in: emailIds } }),
      ClickEvent.countDocuments({ emailId: { $in: emailIds } }),
    ]);

    const openRate = totalEmails > 0 ? (totalOpens / totalEmails) * 100 : 0;
    const clickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;

    res.json({
      totalEmails,
      totalOpens,
      totalClicks,
      openRate: parseFloat(openRate.toFixed(2)),
      clickRate: parseFloat(clickRate.toFixed(2)),
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { emails, emailIds } = await getUserEmailIds(userId);
    const totalEmailsSent = emails.length;

    const [totalOpens, totalClicks] = await Promise.all([
      OpenEvent.countDocuments({ emailId: { $in: emailIds } }),
      ClickEvent.countDocuments({ emailId: { $in: emailIds } }),
    ]);

    const openRate = totalEmailsSent > 0 ? (totalOpens / totalEmailsSent) * 100 : 0;
    const clickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;

    res.json([
      {
        key: "sent",
        label: "Total Emails Sent",
        value: String(totalEmailsSent),
        delta: "",
        trend: "up",
        icon: "send",
      },
      {
        key: "opens",
        label: "Total Opens",
        value: String(totalOpens),
        delta: "",
        trend: "up",
        icon: "eye",
      },
      {
        key: "clicks",
        label: "Total Clicks",
        value: String(totalClicks),
        delta: "",
        trend: "up",
        icon: "mouse",
      },
      {
        key: "openRate",
        label: "Open Rate",
        value: `${openRate.toFixed(1)}%`,
        delta: "",
        trend: "up",
        icon: "percent",
      },
      {
        key: "clickRate",
        label: "Click Rate",
        value: `${clickRate.toFixed(1)}%`,
        delta: "",
        trend: "up",
        icon: "activity",
      },
    ]);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getEmailAnalytics = async (req: any, res: Response) => {
  try {
    const email = await Email.findOne({ _id: req.params.id, userId: req.user.id });
    if (!email) return res.status(404).json({ msg: "Email not found" });

    const [openHistory, clickHistory, opens, clicks] = await Promise.all([
      OpenEvent.find({ emailId: email._id }).sort({ openedAt: -1 }),
      ClickEvent.find({ emailId: email._id }).sort({ clickedAt: -1 }),
      OpenEvent.countDocuments({ emailId: email._id }),
      ClickEvent.countDocuments({ emailId: email._id }),
    ]);

    const uniqueDevices = new Set(openHistory.map((e) => e.deviceType).filter(Boolean));
    const uniqueLocations = new Set(openHistory.map((e) => e.ipAddress).filter(Boolean));

    res.json({
      email: {
        id: email._id.toString(),
        recipient: email.recipient,
        recipientName: email.recipient.split("@")[0].replace(/[._]/g, " "),
        subject: email.subject,
        sentDate: email.sentAt,
        status: resolveEmailStatus(email.status, opens, clicks),
        deliveryStatus: email.status,
        opens,
        clicks,
        preview: email.content.slice(0, 200),
        trackingId: email.trackingId,
      },
      openHistory: openHistory.map((e) => ({
        id: e._id.toString(),
        type: "open" as const,
        label: "Opened email",
        time: e.openedAt,
        location: e.location || e.ipAddress || "Unknown",
        device: e.deviceType || "Unknown",
        browser: e.browser || "Unknown",
      })),
      clickHistory: clickHistory.map((e) => ({
        id: e._id.toString(),
        type: "click" as const,
        label: `Clicked link`,
        time: e.clickedAt,
        location: e.location || e.ipAddress || "Unknown",
        device: e.deviceType || "Unknown",
        browser: e.browser || "Unknown",
        url: e.originalUrl,
      })),
      uniqueDevices: uniqueDevices.size,
      uniqueLocations: uniqueLocations.size,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getTimeseries = async (req: any, res: Response) => {
  try {
    const { emailIds } = await getUserEmailIds(req.user.id);
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const [opens, clicks] = await Promise.all([
      OpenEvent.find({ emailId: { $in: emailIds }, openedAt: { $gte: since } }),
      ClickEvent.find({ emailId: { $in: emailIds }, clickedAt: { $gte: since } }),
    ]);

    const buckets: Record<string, { opens: number; clicks: number; sortKey: string }> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      buckets[key] = { opens: 0, clicks: 0, sortKey: key };
    }

    opens.forEach((e) => {
      const key = new Date(e.openedAt).toISOString().slice(0, 10);
      if (buckets[key]) buckets[key].opens++;
    });

    clicks.forEach((e) => {
      const key = new Date(e.clickedAt).toISOString().slice(0, 10);
      if (buckets[key]) buckets[key].clicks++;
    });

    const data = Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, counts]) => ({
        name: `${DAY_NAMES[new Date(key).getDay()]} ${new Date(key).getMonth() + 1}/${new Date(key).getDate()}`,
        opens: counts.opens,
        clicks: counts.clicks,
      }));
    res.json(data);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getDeviceBreakdown = async (req: any, res: Response) => {
  try {
    const { emailIds } = await getUserEmailIds(req.user.id);
    const events = await OpenEvent.find({ emailId: { $in: emailIds } });
    const counts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };

    events.forEach((e) => {
      const type = e.deviceType || "Desktop";
      counts[type] = (counts[type] || 0) + 1;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const data = Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
      color: DEVICE_COLORS[name] || "var(--color-chart-1)",
    }));

    res.json(data);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getRecentActivity = async (req: any, res: Response) => {
  try {
    const { emails, emailIds } = await getUserEmailIds(req.user.id);
    const emailMap = new Map(emails.map((e) => [e._id.toString(), e]));

    const [opens, clicks] = await Promise.all([
      OpenEvent.find({ emailId: { $in: emailIds } })
        .sort({ openedAt: -1 })
        .limit(10),
      ClickEvent.find({ emailId: { $in: emailIds } })
        .sort({ clickedAt: -1 })
        .limit(10),
    ]);

    const events = [
      ...opens.map((e) => ({
        id: e._id.toString(),
        type: "open" as const,
        label: `Opened: ${emailMap.get(e.emailId.toString())?.subject || "Email"}`,
        time: e.openedAt,
        location: e.location || e.ipAddress || "Unknown",
        device: e.deviceType || "Unknown",
      })),
      ...clicks.map((e) => ({
        id: e._id.toString(),
        type: "click" as const,
        label: `Clicked: ${emailMap.get(e.emailId.toString())?.subject || "Email"}`,
        time: e.clickedAt,
        location: e.location || e.ipAddress || "Unknown",
        device: e.deviceType || "Unknown",
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    res.json(events);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getTopEmails = async (req: any, res: Response) => {
  try {
    const { emails, emailIds } = await getUserEmailIds(req.user.id);

    const enriched = await Promise.all(
      emails.map(async (email) => {
        const [opens, clicks] = await Promise.all([
          OpenEvent.countDocuments({ emailId: email._id }),
          ClickEvent.countDocuments({ emailId: email._id }),
        ]);
        return {
          subject: email.subject,
          recipient: email.recipient.split("@")[0].replace(/[._]/g, " "),
          opens,
          clicks,
          score: opens + clicks,
        };
      }),
    );

    res.json(enriched.sort((a, b) => b.score - a.score).slice(0, 5));
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
