import express from "express";
import {
  createPartner,
  getAllPartners,
  getPartner,
  updatePartner,
  deletePartner,
  addRequestAttachment,
  addApprovalAttachment,
  removeRequestAttachment,
  removeApprovalAttachment,
  markPartnerAsSigned,
  getSignedPartners,
  getUnsignedPartners
} from "../controllers/partnerController.js";
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Protect all routes
router.use(protectAdmin);

// View routes - accessible by all authorized roles
router.get("/", restrictToAdmin("partnership-division", "director", "general-director", "law-service", "law-research"), getAllPartners);
router.get("/signed", restrictToAdmin("partnership-division", "director", "general-director", "law-service", "law-research"), getSignedPartners);
router.get("/unsigned", restrictToAdmin("partnership-division", "director", "general-director", "law-service", "law-research"), getUnsignedPartners);
router.get("/:id", restrictToAdmin("partnership-division", "director", "general-director", "law-service", "law-research"), getPartner);

// Management routes - restricted to partnership-division, director and general-director
router.use(restrictToAdmin("partnership-division", "director", "general-director"));

router.post("/", createPartner);
router.patch("/:id", updatePartner);
router.delete("/:id", deletePartner);
router.patch("/:id/sign", markPartnerAsSigned);

// Attachment routes
router.post("/:id/request-attachments", upload.single("file"), addRequestAttachment);
router.post("/:id/approval-attachments", upload.single("file"), addApprovalAttachment);
router.delete("/:id/request-attachments/:attachmentId", removeRequestAttachment);
router.delete("/:id/approval-attachments/:attachmentId", removeApprovalAttachment);

export default router; 