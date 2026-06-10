import { Request, Response } from "express";
import Template from "../models/Template";

export const getTemplates = async (req: any, res: Response) => {
  try {
    const templates = await Template.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const createTemplate = async (req: any, res: Response) => {
  const { name, subject, content } = req.body;
  if (!name || !subject || !content) {
    return res.status(400).json({ msg: "Name, subject, and content are required" });
  }

  try {
    const newTemplate = new Template({
      userId: req.user.id,
      name,
      subject,
      content,
    });
    const template = await newTemplate.save();
    res.json(template);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateTemplate = async (req: any, res: Response) => {
  const { name, subject, content } = req.body;
  try {
    const template = await Template.findOne({ _id: req.params.id, userId: req.user.id });
    if (!template) return res.status(404).json({ msg: "Template not found" });

    if (name) template.name = name;
    if (subject) template.subject = subject;
    if (content) template.content = content;

    await template.save();
    res.json(template);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const deleteTemplate = async (req: any, res: Response) => {
  try {
    const template = await Template.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!template) {
      return res.status(404).json({ msg: "Template not found" });
    }
    res.json({ msg: "Template removed" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
