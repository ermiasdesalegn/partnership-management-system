import express from "express";
import {
  createActivity,
  getPartnerActivities,
  updateActivityStatus,
  addActivityAttachment,
  removeActivityAttachment,
  getActivityStatistics
} from "../controllers/partnershipActivityController.js";
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All routes require admin authentication
router.use(protectAdmin);

// Only partnership division can manage activities
router.use(restrictToAdmin("partnership-division"));

// Activity management routes
router.post("/:partnerId/activities", createActivity);
router.get("/:partnerId/activities", getPartnerActivities);
router.patch("/activities/:activityId/status", updateActivityStatus);
router.get("/:partnerId/statistics", getActivityStatistics);

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