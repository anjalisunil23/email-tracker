export type EmailStatus = "opened" | "clicked" | "delivered" | "bounced";

export interface EmailRecord {
  id: string;
  recipient: string;
  recipientName: string;
  subject: string;
  sentDate: string;
  status: EmailStatus;
  opens: number;
  clicks: number;
  preview: string;
}

export interface TrackingEvent {
  id: string;
  type: "open" | "click" | "delivered";
  label: string;
  time: string;
  location: string;
  device: string;
  browser: string;
}

export const stats = [
  {
    key: "sent",
    label: "Total Emails Sent",
    value: "12,840",
    delta: "+8.2%",
    trend: "up" as const,
    icon: "send",
  },
  {
    key: "opens",
    label: "Total Opens",
    value: "9,612",
    delta: "+12.4%",
    trend: "up" as const,
    icon: "eye",
  },
  {
    key: "clicks",
    label: "Total Clicks",
    value: "3,204",
    delta: "+5.1%",
    trend: "up" as const,
    icon: "mouse",
  },
  {
    key: "openRate",
    label: "Open Rate",
    value: "74.8%",
    delta: "+3.6%",
    trend: "up" as const,
    icon: "percent",
  },
  {
    key: "clickRate",
    label: "Click Rate",
    value: "24.9%",
    delta: "-1.2%",
    trend: "down" as const,
    icon: "activity",
  },
];

export const opensChartData = [
  { name: "Mon", opens: 420, clicks: 140 },
  { name: "Tue", opens: 560, clicks: 190 },
  { name: "Wed", opens: 490, clicks: 160 },
  { name: "Thu", opens: 680, clicks: 240 },
  { name: "Fri", opens: 740, clicks: 280 },
  { name: "Sat", opens: 380, clicks: 110 },
  { name: "Sun", opens: 310, clicks: 95 },
];

export const trendData = [
  { name: "Jan", openRate: 62, clickRate: 18 },
  { name: "Feb", openRate: 65, clickRate: 20 },
  { name: "Mar", openRate: 68, clickRate: 22 },
  { name: "Apr", openRate: 64, clickRate: 19 },
  { name: "May", openRate: 71, clickRate: 23 },
  { name: "Jun", openRate: 74, clickRate: 25 },
  { name: "Jul", openRate: 75, clickRate: 24 },
];

export const deviceData = [
  { name: "Desktop", value: 52, color: "var(--color-chart-1)" },
  { name: "Mobile", value: 38, color: "var(--color-chart-2)" },
  { name: "Tablet", value: 10, color: "var(--color-chart-3)" },
];

export const emails: EmailRecord[] = [
  {
    id: "em-1042",
    recipient: "sarah.chen@acmecorp.com",
    recipientName: "Sarah Chen",
    subject: "Your Q3 product roadmap is ready",
    sentDate: "2026-06-07T09:14:00Z",
    status: "clicked",
    opens: 6,
    clicks: 3,
    preview: "Hi Sarah, we've put together the roadmap covering all upcoming releases...",
  },
  {
    id: "em-1041",
    recipient: "m.johnson@brightlabs.io",
    recipientName: "Marcus Johnson",
    subject: "Quick question about your trial",
    sentDate: "2026-06-07T08:02:00Z",
    status: "opened",
    opens: 2,
    clicks: 0,
    preview: "Hey Marcus, noticed you started a trial last week. Anything I can help with?",
  },
  {
    id: "em-1040",
    recipient: "lena@designstudio.co",
    recipientName: "Lena Park",
    subject: "Invoice #4821 — June",
    sentDate: "2026-06-06T16:45:00Z",
    status: "delivered",
    opens: 0,
    clicks: 0,
    preview: "Please find attached your invoice for June. Payment is due within 14 days.",
  },
  {
    id: "em-1039",
    recipient: "david.kim@nova.dev",
    recipientName: "David Kim",
    subject: "Welcome to MailTrack 🎉",
    sentDate: "2026-06-06T11:20:00Z",
    status: "clicked",
    opens: 9,
    clicks: 5,
    preview: "Welcome aboard! Here's how to get the most out of your new tracking tools.",
  },
  {
    id: "em-1038",
    recipient: "p.alvarez@globex.com",
    recipientName: "Paula Alvarez",
    subject: "Following up on our call",
    sentDate: "2026-06-05T14:30:00Z",
    status: "opened",
    opens: 4,
    clicks: 0,
    preview: "Great chatting earlier — here are the resources I mentioned during our call.",
  },
  {
    id: "em-1037",
    recipient: "tom@hilltop.org",
    recipientName: "Tom Becker",
    subject: "Your demo recording is here",
    sentDate: "2026-06-05T10:05:00Z",
    status: "bounced",
    opens: 0,
    clicks: 0,
    preview: "Thanks for joining the demo. You can rewatch the full session anytime.",
  },
  {
    id: "em-1036",
    recipient: "grace@finlytics.app",
    recipientName: "Grace Wong",
    subject: "Special offer just for you",
    sentDate: "2026-06-04T13:15:00Z",
    status: "clicked",
    opens: 7,
    clicks: 2,
    preview: "We're offering 20% off annual plans this week only — don't miss out!",
  },
  {
    id: "em-1035",
    recipient: "ahmed.r@vertex.io",
    recipientName: "Ahmed Rahman",
    subject: "Reminder: meeting tomorrow",
    sentDate: "2026-06-04T09:00:00Z",
    status: "opened",
    opens: 3,
    clicks: 0,
    preview: "Just a friendly reminder about our meeting scheduled for tomorrow at 2pm.",
  },
  {
    id: "em-1034",
    recipient: "n.silva@orbit.team",
    recipientName: "Nina Silva",
    subject: "New feature: smart scheduling",
    sentDate: "2026-06-03T17:40:00Z",
    status: "clicked",
    opens: 5,
    clicks: 4,
    preview: "We just shipped smart scheduling — send emails at the perfect time, automatically.",
  },
  {
    id: "em-1033",
    recipient: "carlos@mintware.dev",
    recipientName: "Carlos Mendez",
    subject: "Account upgrade confirmation",
    sentDate: "2026-06-03T08:25:00Z",
    status: "delivered",
    opens: 0,
    clicks: 0,
    preview: "Your account has been upgraded to Pro. Enjoy the new limits and features.",
  },
  {
    id: "em-1032",
    recipient: "emma@studioloop.com",
    recipientName: "Emma Lewis",
    subject: "We miss you — come back?",
    sentDate: "2026-06-02T12:10:00Z",
    status: "opened",
    opens: 1,
    clicks: 0,
    preview: "It's been a while! Here's what's new since you last logged in.",
  },
  {
    id: "em-1031",
    recipient: "raj@cloudbridge.io",
    recipientName: "Raj Patel",
    subject: "Your weekly performance digest",
    sentDate: "2026-06-02T07:30:00Z",
    status: "clicked",
    opens: 8,
    clicks: 6,
    preview: "Here's how your campaigns performed this week, with key highlights inside.",
  },
];

export const topEmails = [...emails]
  .sort((a, b) => b.opens + b.clicks - (a.opens + a.clicks))
  .slice(0, 5)
  .map((e) => ({
    subject: e.subject,
    recipient: e.recipientName,
    openRate: Math.min(99, Math.round((e.opens / 10) * 100)),
    clicks: e.clicks,
  }));

export function getEmail(id: string) {
  return emails.find((e) => e.id === id);
}

export const trackingTimeline: TrackingEvent[] = [
  {
    id: "t1",
    type: "delivered",
    label: "Email delivered",
    time: "2026-06-07T09:14:00Z",
    location: "—",
    device: "—",
    browser: "—",
  },
  {
    id: "t2",
    type: "open",
    label: "Opened email",
    time: "2026-06-07T09:31:00Z",
    location: "San Francisco, US",
    device: "Desktop",
    browser: "Chrome 126",
  },
  {
    id: "t3",
    type: "click",
    label: "Clicked “View roadmap”",
    time: "2026-06-07T09:33:00Z",
    location: "San Francisco, US",
    device: "Desktop",
    browser: "Chrome 126",
  },
  {
    id: "t4",
    type: "open",
    label: "Opened email",
    time: "2026-06-07T14:02:00Z",
    location: "San Francisco, US",
    device: "Mobile",
    browser: "Safari iOS",
  },
  {
    id: "t5",
    type: "click",
    label: "Clicked “Book a call”",
    time: "2026-06-07T14:05:00Z",
    location: "San Francisco, US",
    device: "Mobile",
    browser: "Safari iOS",
  },
  {
    id: "t6",
    type: "open",
    label: "Opened email",
    time: "2026-06-08T08:20:00Z",
    location: "Oakland, US",
    device: "Tablet",
    browser: "Chrome 126",
  },
];

export const recentActivity = trackingTimeline.filter((t) => t.type !== "delivered").slice(0, 5);

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
