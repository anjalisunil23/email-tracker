import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import config from "../config";

function signToken(userId: string, rememberMe = false) {
  const payload = { user: { id: userId } };
  const expiresIn = rememberMe ? "30d" : "1h";
  return jwt.sign(payload, config.jwtSecret!, { expiresIn });
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = signToken(user.id, true);
    res.json({ token });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = signToken(user.id, !!rememberMe);
    res.json({ token });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password -smtpPassword");
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateProfile = async (req: any, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ msg: "Email already in use" });
      user.email = email;
    }

    await user.save();
    const updated = await User.findById(req.user.id).select("-password -smtpPassword");
    res.json(updated);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const changePassword = async (req: any, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: "Current and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ msg: "New password must be at least 6 characters" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ msg: "Password updated successfully" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
