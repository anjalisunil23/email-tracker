import { Router } from "express";
import {
  getSummary,
  getDashboardStats,
  getEmailAnalytics,
  getTimeseries,
  getDeviceBreakdown,
  getRecentActivity,
  getTopEmails,
} from "../controllers/analyticsController";
import auth from "../middleware/auth";

const router = Router();

router.get("/summary", auth, getSummary); // Summary endpoint for testing
router.get("/dashboard", auth, getDashboardStats);
router.get("/timeseries", auth, getTimeseries);
router.get("/devices", auth, getDeviceBreakdown);
router.get("/recent-activity", auth, getRecentActivity);
router.get("/top-emails", auth, getTopEmails);
router.get("/emails", auth, getTopEmails); // Alias for /top-emails
router.get("/email/:id", auth, getEmailAnalytics);
router.get("/:id", auth, getEmailAnalytics); // Alias for /email/:id

export default router;
