import mongoose from "mongoose";

const OpenEventSchema = new mongoose.Schema({
  emailId: { type: mongoose.Schema.Types.ObjectId, ref: "Email", required: true },
  openedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  deviceType: { type: String, default: "Unknown" },
  browser: { type: String, default: "Unknown" },
  operatingSystem: { type: String, default: "Unknown" },
  location: { type: String, default: "Unknown" },
});

export default mongoose.model("OpenEvent", OpenEventSchema);
