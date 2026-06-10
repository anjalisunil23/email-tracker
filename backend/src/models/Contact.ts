import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", ContactSchema);
