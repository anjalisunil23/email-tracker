import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: String, required: true },
  cc: { type: [String], default: [] },
  bcc: { type: [String], default: [] },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  trackingId: { type: String, required: true, unique: true },
  scheduleAt: { type: Date },
  status: { type: String, enum: ["pending", "sent", "failed"], default: "sent" },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model("Email", EmailSchema);
