import express from "express";
import multer from "multer";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
} from "../controllers/contactController";
import authMiddleware from "../middleware/auth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 } });

router.get("/", authMiddleware, getContacts);
router.post("/", authMiddleware, createContact);
router.post("/import", authMiddleware, upload.single("file"), importContacts);
router.put("/:id", authMiddleware, updateContact);
router.delete("/:id", authMiddleware, deleteContact);

export default router;
