import express from "express";
import {
  createActivity,
  getPartnerActivities,
  updateActivityStatus,
  deleteActivity,
  addActivityAttachment,
  removeActivityAttachment,
  getActivityStatistics
} from "../controllers/partnershipActivityController.js";
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Protect all routes
router.use(protectAdmin);

// Activity management routes - accessible by partnership-division, director and general-director
router.post("/:partnerId/activities", restrictToAdmin("partnership-division", "director", "general-director"), createActivity);
router.get("/:partnerId/activities", restrictToAdmin("partnership-division", "director", "general-director", "law-service", "law-research"), getPartnerActivities);
router.get("/:partnerId/statistics", restrictToAdmin("partnership-division", "director", "general-director", "law-service", "law-research"), getActivityStatistics);

// Individual activity management
router.patch("/activities/:activityId/status", restrictToAdmin("partnership-division", "director", "general-director"), updateActivityStatus);
router.delete("/activities/:activityId", restrictToAdmin("partnership-division", "director", "general-director"), deleteActivity);

// Attachment routes
router.post("/activities/:activityId/attachments", restrictToAdmin("partnership-division", "director", "general-director"), upload.single("file"), addActivityAttachment);
router.delete("/activities/:activityId/attachments/:attachmentId", restrictToAdmin("partnership-division", "director", "general-director"), removeActivityAttachment);

export default router; 