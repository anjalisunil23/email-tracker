import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import Email from '../models/Email';
import OpenEvent from '../models/OpenEvent';
import ClickEvent from '../models/ClickEvent';

const DEMO_EMAIL = 'anjali@mailtrack.io';
const DEMO_NAME = 'Anjali Sunil';

function daysAgo(days: number, hours = 10, minutes = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

async function ensureDemoUser() {
  let user = await User.findOne({ email: DEMO_EMAIL });
  if (user) {
    if (user.name !== DEMO_NAME) {
      user.name = DEMO_NAME;
      await user.save();
    }
    return user;
  }

  // Remove legacy demo account if present
  await User.deleteOne({ email: 'alex@mailtrack.io' });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password', salt);

  user = await User.create({
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    password,
  });

  console.log(`Seeded demo user (${DEMO_EMAIL} / password)`);
  return user;
}

async function seedDemoEmails(userId: string) {
  const existing = await Email.countDocuments({ userId });
  if (existing > 0) return;

  const demoEmails = [
    {
      recipient: 'sarah.chen@acmecorp.com',
      subject: 'Your Q3 product roadmap is ready',
      content: 'Hi Sarah, we have put together the roadmap covering all upcoming releases. View it here: https://acmecorp.com/roadmap',
      sentAt: daysAgo(0, 9, 14),
      opens: [
        { at: daysAgo(0, 9, 31), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '192.168.1.10' },
        { at: daysAgo(0, 14, 2), device: 'Mobile', browser: 'Safari', os: 'iOS', ip: '192.168.1.11' },
      ],
      clicks: [
        { at: daysAgo(0, 9, 33), url: 'https://acmecorp.com/roadmap', device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '192.168.1.10' },
        { at: daysAgo(0, 14, 5), url: 'https://acmecorp.com/roadmap', device: 'Mobile', browser: 'Safari', os: 'iOS', ip: '192.168.1.11' },
      ],
    },
    {
      recipient: 'm.johnson@brightlabs.io',
      subject: 'Quick question about your trial',
      content: 'Hey Marcus, noticed you started a trial last week. Anything I can help with?',
      sentAt: daysAgo(0, 8, 2),
      opens: [
        { at: daysAgo(0, 8, 45), device: 'Desktop', browser: 'Firefox', os: 'MacOS', ip: '10.0.0.5' },
        { at: daysAgo(0, 12, 10), device: 'Desktop', browser: 'Firefox', os: 'MacOS', ip: '10.0.0.5' },
      ],
      clicks: [],
    },
    {
      recipient: 'lena@designstudio.co',
      subject: 'Invoice #4821 — June',
      content: 'Please find attached your invoice for June. Payment is due within 14 days.',
      sentAt: daysAgo(1, 16, 45),
      opens: [],
      clicks: [],
    },
    {
      recipient: 'david.kim@nova.dev',
      subject: 'Welcome to MailTrack',
      content: 'Welcome aboard! Get started at https://mailtrack.io/start and book a demo at https://mailtrack.io/demo',
      sentAt: daysAgo(1, 11, 20),
      opens: [
        { at: daysAgo(1, 11, 35), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '172.16.0.2' },
        { at: daysAgo(1, 15, 0), device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '172.16.0.3' },
        { at: daysAgo(0, 8, 20), device: 'Tablet', browser: 'Safari', os: 'iOS', ip: '172.16.0.4' },
      ],
      clicks: [
        { at: daysAgo(1, 11, 36), url: 'https://mailtrack.io/start', device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '172.16.0.2' },
        { at: daysAgo(1, 15, 2), url: 'https://mailtrack.io/demo', device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '172.16.0.3' },
      ],
    },
    {
      recipient: 'p.alvarez@globex.com',
      subject: 'Following up on our call',
      content: 'Great chatting earlier — here are the resources I mentioned: https://globex.com/resources',
      sentAt: daysAgo(2, 14, 30),
      opens: [
        { at: daysAgo(2, 16, 0), device: 'Desktop', browser: 'Edge', os: 'Windows', ip: '203.0.113.1' },
        { at: daysAgo(2, 18, 15), device: 'Desktop', browser: 'Edge', os: 'Windows', ip: '203.0.113.1' },
        { at: daysAgo(1, 9, 0), device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '203.0.113.2' },
        { at: daysAgo(1, 9, 5), device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '203.0.113.2' },
      ],
      clicks: [],
    },
    {
      recipient: 'grace@finlytics.app',
      subject: 'Special offer just for you',
      content: 'We are offering 20% off annual plans this week only: https://finlytics.app/offer',
      sentAt: daysAgo(3, 13, 15),
      opens: [
        { at: daysAgo(3, 14, 0), device: 'Desktop', browser: 'Chrome', os: 'MacOS', ip: '198.51.100.1' },
        { at: daysAgo(3, 19, 30), device: 'Mobile', browser: 'Safari', os: 'iOS', ip: '198.51.100.2' },
        { at: daysAgo(2, 10, 0), device: 'Desktop', browser: 'Chrome', os: 'MacOS', ip: '198.51.100.1' },
      ],
      clicks: [
        { at: daysAgo(3, 14, 2), url: 'https://finlytics.app/offer', device: 'Desktop', browser: 'Chrome', os: 'MacOS', ip: '198.51.100.1' },
        { at: daysAgo(2, 10, 1), url: 'https://finlytics.app/offer', device: 'Desktop', browser: 'Chrome', os: 'MacOS', ip: '198.51.100.1' },
      ],
    },
    {
      recipient: 'ahmed.r@vertex.io',
      subject: 'Reminder: meeting tomorrow',
      content: 'Just a friendly reminder about our meeting scheduled for tomorrow at 2pm.',
      sentAt: daysAgo(3, 9, 0),
      opens: [
        { at: daysAgo(3, 9, 15), device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '10.1.1.1' },
        { at: daysAgo(2, 8, 0), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '10.1.1.2' },
        { at: daysAgo(2, 8, 30), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '10.1.1.2' },
      ],
      clicks: [],
    },
    {
      recipient: 'n.silva@orbit.team',
      subject: 'New feature: smart scheduling',
      content: 'We just shipped smart scheduling. Learn more at https://orbit.team/scheduling',
      sentAt: daysAgo(4, 17, 40),
      opens: [
        { at: daysAgo(4, 18, 0), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '192.0.2.1' },
        { at: daysAgo(4, 20, 0), device: 'Mobile', browser: 'Safari', os: 'iOS', ip: '192.0.2.2' },
        { at: daysAgo(3, 11, 0), device: 'Tablet', browser: 'Chrome', os: 'Android', ip: '192.0.2.3' },
        { at: daysAgo(2, 9, 0), device: 'Desktop', browser: 'Firefox', os: 'Linux', ip: '192.0.2.4' },
        { at: daysAgo(1, 14, 0), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '192.0.2.1' },
      ],
      clicks: [
        { at: daysAgo(4, 18, 1), url: 'https://orbit.team/scheduling', device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '192.0.2.1' },
        { at: daysAgo(3, 11, 2), url: 'https://orbit.team/scheduling', device: 'Tablet', browser: 'Chrome', os: 'Android', ip: '192.0.2.3' },
        { at: daysAgo(2, 9, 1), url: 'https://orbit.team/scheduling', device: 'Desktop', browser: 'Firefox', os: 'Linux', ip: '192.0.2.4' },
        { at: daysAgo(1, 14, 3), url: 'https://orbit.team/scheduling', device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '192.0.2.1' },
      ],
    },
    {
      recipient: 'carlos@mintware.dev',
      subject: 'Account upgrade confirmation',
      content: 'Your account has been upgraded to Pro. Enjoy the new limits and features.',
      sentAt: daysAgo(5, 8, 25),
      opens: [],
      clicks: [],
    },
    {
      recipient: 'emma@studioloop.com',
      subject: 'We miss you — come back?',
      content: 'It has been a while! Here is what is new since you last logged in: https://studioloop.com/whats-new',
      sentAt: daysAgo(5, 12, 10),
      opens: [
        { at: daysAgo(5, 14, 0), device: 'Mobile', browser: 'Safari', os: 'iOS', ip: '10.2.2.1' },
      ],
      clicks: [],
    },
    {
      recipient: 'raj@cloudbridge.io',
      subject: 'Your weekly performance digest',
      content: 'Here is how your campaigns performed this week: https://cloudbridge.io/digest',
      sentAt: daysAgo(6, 7, 30),
      opens: [
        { at: daysAgo(6, 8, 0), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '10.3.3.1' },
        { at: daysAgo(6, 8, 5), device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '10.3.3.1' },
        { at: daysAgo(5, 9, 0), device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '10.3.3.2' },
        { at: daysAgo(4, 10, 0), device: 'Desktop', browser: 'Edge', os: 'Windows', ip: '10.3.3.1' },
        { at: daysAgo(3, 11, 0), device: 'Tablet', browser: 'Safari', os: 'iOS', ip: '10.3.3.3' },
        { at: daysAgo(2, 12, 0), device: 'Desktop', browser: 'Chrome', os: 'MacOS', ip: '10.3.3.4' },
      ],
      clicks: [
        { at: daysAgo(6, 8, 1), url: 'https://cloudbridge.io/digest', device: 'Desktop', browser: 'Chrome', os: 'Windows', ip: '10.3.3.1' },
        { at: daysAgo(5, 9, 2), url: 'https://cloudbridge.io/digest', device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '10.3.3.2' },
        { at: daysAgo(4, 10, 1), url: 'https://cloudbridge.io/digest', device: 'Desktop', browser: 'Edge', os: 'Windows', ip: '10.3.3.1' },
        { at: daysAgo(3, 11, 2), url: 'https://cloudbridge.io/digest', device: 'Tablet', browser: 'Safari', os: 'iOS', ip: '10.3.3.3' },
        { at: daysAgo(2, 12, 1), url: 'https://cloudbridge.io/digest', device: 'Desktop', browser: 'Chrome', os: 'MacOS', ip: '10.3.3.4' },
        { at: daysAgo(1, 13, 0), url: 'https://cloudbridge.io/digest', device: 'Desktop', browser: 'Chrome', os: 'MacOS', ip: '10.3.3.4' },
      ],
    },
    {
      recipient: 'tom@hilltop.org',
      subject: 'Your demo recording is here',
      content: 'Thanks for joining the demo. Rewatch at https://hilltop.org/demo-recording',
      sentAt: daysAgo(6, 10, 5),
      opens: [
        { at: daysAgo(6, 11, 0), device: 'Desktop', browser: 'Firefox', os: 'Linux', ip: '10.4.4.1' },
        { at: daysAgo(5, 15, 0), device: 'Desktop', browser: 'Firefox', os: 'Linux', ip: '10.4.4.1' },
        { at: daysAgo(4, 16, 0), device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '10.4.4.2' },
      ],
      clicks: [
        { at: daysAgo(6, 11, 1), url: 'https://hilltop.org/demo-recording', device: 'Desktop', browser: 'Firefox', os: 'Linux', ip: '10.4.4.1' },
        { at: daysAgo(4, 16, 2), url: 'https://hilltop.org/demo-recording', device: 'Mobile', browser: 'Chrome', os: 'Android', ip: '10.4.4.2' },
      ],
    },
  ];

  for (const item of demoEmails) {
    const email = await Email.create({
      userId,
      recipient: item.recipient,
      subject: item.subject,
      content: item.content,
      trackingId: uuidv4(),
      sentAt: item.sentAt,
    });

    for (const open of item.opens) {
      await OpenEvent.create({
        emailId: email._id,
        openedAt: open.at,
        ipAddress: open.ip,
        deviceType: open.device,
        browser: open.browser,
        operatingSystem: open.os,
        userAgent: `${open.browser}/${open.os}`,
      });
    }

    for (const click of item.clicks) {
      await ClickEvent.create({
        emailId: email._id,
        clickedAt: click.at,
        originalUrl: click.url,
        ipAddress: click.ip,
        deviceType: click.device,
        browser: click.browser,
        operatingSystem: click.os,
        userAgent: `${click.browser}/${click.os}`,
      });
    }
  }

  const totalOpens = demoEmails.reduce((sum, e) => sum + e.opens.length, 0);
  const totalClicks = demoEmails.reduce((sum, e) => sum + e.clicks.length, 0);
  console.log(`Seeded ${demoEmails.length} demo emails with ${totalOpens} opens and ${totalClicks} clicks`);
}

const seedDemoUser = async () => {
  const user = await ensureDemoUser();
  await seedDemoEmails(user._id.toString());
};

export default seedDemoUser;
