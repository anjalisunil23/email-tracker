import nodemailer from "nodemailer";
import config from "../config";
import { decrypt } from "./crypto";

export function createGmailTransporter(email: string, password: string) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user: email, pass: password },
  });
}

const useDevTransport =
  process.env.SKIP_SMTP === "true" || !config.emailUser || config.emailUser.includes("example@");

export const fallbackTransporter = useDevTransport
  ? nodemailer.createTransport({ jsonTransport: true })
  : createGmailTransporter(config.emailUser!, config.emailPass!);

export function formatFromAddress(email: string, name = "Mail Tracker") {
  return { name, address: email };
}

export async function getTransporterForUser(userId: string) {
  const User = (await import("../models/User")).default;
  const user = await User.findById(userId);

  if (user?.smtpEmail && user?.smtpPassword) {
    const pass = decrypt(user.smtpPassword);
    return {
      transporter: createGmailTransporter(user.smtpEmail, pass),
      fromEmail: user.smtpEmail,
      fromName: user.name || "Mail Tracker",
      isReal: true,
    };
  }

  return {
    transporter: fallbackTransporter,
    fromEmail: config.emailUser || "mailtrack@localhost",
    fromName: "Mail Tracker",
    isReal: !useDevTransport,
  };
}
