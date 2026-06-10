import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  smtpEmail: { type: String, default: "" },
  smtpPassword: { type: String, default: "" },
  notificationPrefs: {
    opens: { type: Boolean, default: true },
    clicks: { type: Boolean, default: true },
    digest: { type: Boolean, default: true },
    product: { type: Boolean, default: false },
  },
});

export default mongoose.model("User", UserSchema);
