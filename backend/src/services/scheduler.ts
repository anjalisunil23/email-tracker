import cron from "node-cron";
import Email from "../models/Email";
import config from "../config";
import { buildTrackedHtml, htmlToPlainText } from "../utils/emailHelpers";
import { formatFromAddress, getTransporterForUser } from "../utils/mailTransport";

// Function exported for the controller to use
export const scheduleEmail = (email: any) => {
  console.log(`[Scheduler] Email ${email._id} scheduled for ${email.scheduleAt}`);
};

// Start the cron job to poll for pending emails
export const startScheduler = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      // Find emails that are pending and their schedule time is in the past or now
      const pendingEmails = await Email.find({
        status: "pending",
        scheduleAt: { $lte: now },
      });

      for (const email of pendingEmails) {
        try {
          console.log(`[Scheduler] Sending scheduled email ${email._id}`);

          const htmlContent = buildTrackedHtml(email.content, email.trackingId, config.backendUrl);
          const textContent = htmlToPlainText(email.content);

          const { transporter, fromEmail, fromName } = await getTransporterForUser(
            email.userId.toString(),
          );

          await transporter.sendMail({
            from: formatFromAddress(fromEmail, fromName),
            to: email.recipient,
            cc: email.cc?.length ? email.cc : undefined,
            bcc: email.bcc?.length ? email.bcc : undefined,
            replyTo: fromEmail,
            subject: email.subject,
            text: textContent,
            html: htmlContent,
          });

          // Update status to sent
          email.status = "sent";
          await email.save();

          console.log(`[Scheduler] Successfully sent email ${email._id}`);
        } catch (sendErr) {
          console.error(`[Scheduler] Error sending email ${email._id}:`, sendErr);
          email.status = "failed";
          await email.save();
        }
      }
    } catch (err) {
      console.error("[Scheduler] Error in cron job:", err);
    }
  });
  console.log("[Scheduler] Cron job started.");
};
