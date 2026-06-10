import mongoose from "mongoose";

const ClickEventSchema = new mongoose.Schema({
  emailId: { type: mongoose.Schema.Types.ObjectId, ref: "Email", required: true },
  clickedAt: { type: Date, default: Date.now },
  originalUrl: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  deviceType: { type: String, default: "Unknown" },
  browser: { type: String, default: "Unknown" },
  operatingSystem: { type: String, default: "Unknown" },
  location: { type: String, default: "Unknown" },
});

export default mongoose.model("ClickEvent", ClickEventSchema);
