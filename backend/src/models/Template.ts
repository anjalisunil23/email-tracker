import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true }, // HTML content
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Template", TemplateSchema);
