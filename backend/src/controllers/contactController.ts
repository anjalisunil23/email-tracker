import { Request, Response } from 'express';
import Contact from '../models/Contact';

export const getContacts = async (req: any, res: Response) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const createContact = async (req: any, res: Response) => {
  const { name, email, company } = req.body;
  if (!name || !email) {
    return res.status(400).json({ msg: 'Name and email are required' });
  }

  try {
    const newContact = new Contact({
      userId: req.user.id,
      name,
      email,
      company,
    });
    const contact = await newContact.save();
    res.json(contact);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const deleteContact = async (req: any, res: Response) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.json({ msg: 'Contact removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
