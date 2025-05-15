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
  removeApprovalAttachment
} from "../controllers/partnerController.js";
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Protect all routes
router.use(protectAdmin);

// Restrict to partnership-division and general-director
router.use(restrictToAdmin("partnership-division", "general-director"));

// Partner routes
router.route("/")
  .get(getAllPartners)
  .post(createPartner);

router.route("/:id")
  .get(getPartner)
  .patch(updatePartner)
  .delete(deletePartner);

// Attachment routes
router.post("/:id/request-attachments", upload.single("file"), addRequestAttachment);
router.post("/:id/approval-attachments", upload.single("file"), addApprovalAttachment);
router.delete("/:id/request-attachments/:attachmentId", removeRequestAttachment);
router.delete("/:id/approval-attachments/:attachmentId", removeApprovalAttachment);

export default router; 