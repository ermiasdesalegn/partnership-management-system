import express from "express";
import {
  createActivity,
  getPartnerActivities,
  updateActivityStatus,
  addActivityAttachment,
  removeActivityAttachment,
  getActivityStatistics,
  deleteActivity
} from "../controllers/partnershipActivityController.js";
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes require admin authentication
router.use(protectAdmin);

// Get activities and statistics - accessible by all authorized roles
router.get("/:partnerId/activities", restrictToAdmin("general-director", "partnership-division", "director"), getPartnerActivities);
router.get("/:partnerId/statistics", restrictToAdmin("general-director", "partnership-division", "director"), getActivityStatistics);

// Management routes - accessible by general-director, partnership-division, and director
router.use(restrictToAdmin("general-director", "partnership-division", "director"));

// Activity management routes
router.post("/:partnerId/activities", createActivity);
router.patch("/activities/:activityId/status", updateActivityStatus);
router.delete("/activities/:activityId", deleteActivity);

// Attachment management routes
router.post(
  "/activities/:activityId/attachments",
  upload.single("file"),
  addActivityAttachment
);
router.delete(
  "/activities/:activityId/attachments/:attachmentId",
  removeActivityAttachment
);

export default router; 