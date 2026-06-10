import { Request, Response } from "express";
import Contact from "../models/Contact";

export const getContacts = async (req: any, res: Response) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const createContact = async (req: any, res: Response) => {
  const { name, email, company } = req.body;
  if (!name || !email) {
    return res.status(400).json({ msg: "Name and email are required" });
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
    res.status(500).send("Server error");
  }
};

export const updateContact = async (req: any, res: Response) => {
  const { name, email, company } = req.body;
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.id });
    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    if (name) contact.name = name;
    if (email) contact.email = email;
    if (company !== undefined) contact.company = company;

    await contact.save();
    res.json(contact);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const importContacts = async (req: any, res: Response) => {
  try {
    const csvText = req.body.csv || req.file?.buffer?.toString("utf8");
    if (!csvText) return res.status(400).json({ msg: "CSV content is required" });

    const Papa = require("papaparse");
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (parsed.errors?.length) {
      return res.status(400).json({ msg: "Invalid CSV format", errors: parsed.errors });
    }

    const rows = parsed.data as Array<{ name?: string; email?: string; company?: string }>;
    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = (row.name || "").trim();
      const email = (row.email || "").trim();
      const company = (row.company || "").trim();
      if (!name || !email) {
        skipped++;
        continue;
      }
      const existing = await Contact.findOne({ userId: req.user.id, email });
      if (existing) {
        skipped++;
        continue;
      }
      await new Contact({ userId: req.user.id, name, email, company }).save();
      imported++;
    }

    res.json({ msg: `Imported ${imported} contacts`, imported, skipped });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const deleteContact = async (req: any, res: Response) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }
    res.json({ msg: "Contact removed" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
