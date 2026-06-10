import { Router } from "express";
import {
  sendEmail,
  listEmails,
  getEmailById,
  getScheduledEmails,
  cancelScheduledEmail,
} from "../controllers/emailController";
import auth from "../middleware/auth";

const router = Router();

router.get("/", auth, listEmails);
router.get("/list", auth, listEmails);
router.get("/scheduled", auth, getScheduledEmails);
router.post("/send", auth, sendEmail);
router.delete("/scheduled/:id", auth, cancelScheduledEmail);
router.get("/:id", auth, getEmailById);

export default router;
