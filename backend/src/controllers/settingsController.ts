import { Request, Response } from "express";
import User from "../models/User";
import { encrypt } from "../utils/crypto";

export const getSettings = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password -smtpPassword");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      smtpEmail: user.smtpEmail || "",
      hasSmtpPassword: !!user.smtpPassword,
      notificationPrefs: user.notificationPrefs || {
        opens: true,
        clicks: true,
        digest: true,
        product: false,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateSettings = async (req: any, res: Response) => {
  const { smtpEmail, smtpPassword, notificationPrefs } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (smtpEmail !== undefined) user.smtpEmail = smtpEmail;
    if (smtpPassword !== undefined && smtpPassword !== "") {
      user.smtpPassword = encrypt(smtpPassword);
    }
    if (notificationPrefs) {
      user.notificationPrefs = {
        opens: notificationPrefs.opens ?? user.notificationPrefs?.opens ?? true,
        clicks: notificationPrefs.clicks ?? user.notificationPrefs?.clicks ?? true,
        digest: notificationPrefs.digest ?? user.notificationPrefs?.digest ?? true,
        product: notificationPrefs.product ?? user.notificationPrefs?.product ?? false,
      };
    }

    await user.save();
    res.json({ msg: "Settings updated successfully" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
