import express from "express";
import {
  signup,
  login,
  protect,
  restrictTo,
  getAllAdmins,
  sendToLawDepartment,
  reviewRequest,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", login);

// Protected routes
router.use(protect);

router.post("/signup", restrictTo("general-director"), signup);
router.get("/", restrictTo("general-director"), getAllAdmins);
router.post("/send-to-law", restrictTo("partnership-division"), sendToLawDepartment);
router.post("/review-request/:requestId", restrictTo("law-department"), reviewRequest);

export default router;
