import express from "express";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templateController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, getTemplates);
router.post("/", authMiddleware, createTemplate);
router.put("/:id", authMiddleware, updateTemplate);
router.delete("/:id", authMiddleware, deleteTemplate);

export default router;
