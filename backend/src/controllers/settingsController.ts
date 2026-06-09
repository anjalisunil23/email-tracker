import { Request, Response } from 'express';
import User from '../models/User';

export const getSettings = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({
      smtpEmail: user.smtpEmail || '',
      hasSmtpPassword: !!user.smtpPassword, // Don't send the actual password back
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const updateSettings = async (req: any, res: Response) => {
  const { smtpEmail, smtpPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (smtpEmail !== undefined) user.smtpEmail = smtpEmail;
    if (smtpPassword !== undefined && smtpPassword !== '') user.smtpPassword = smtpPassword;

    await user.save();
    res.json({ msg: 'Settings updated successfully' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
