require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const nodemailer = require("nodemailer");

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const to = process.argv[2] || user;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user, pass },
});

transporter
  .sendMail({
    from: { name: "Mail Tracker", address: user },
    to,
    subject: `Mail Tracker delivery test ${Date.now()}`,
    text: "If you receive this in your inbox, Gmail SMTP delivery is working.",
    html: "<p>If you receive this in your <strong>inbox</strong>, Gmail SMTP delivery is working.</p>",
  })
  .then((r) => console.log("SUCCESS", r.messageId, r.response))
  .catch((e) => console.error("FAILED", e.message, e.response || ""));
