import express from "express";
import {
  signup,
  login,
  logout,
  getAllAdmins,
  getMe,
  updateMe,
  updateMyPassword,
  uploadProfilePhoto,
  uploadCoverPhoto,
  getAllRequests,
  getAllUsers,
  getAllExternalUsers,
  getAllInternalUsers,
  getInternalUserRequests,
  getExternalUserRequests,
  sendToLawDepartment
  // sendToLawDepartment,
  // reviewRequest,
} from "../controllers/adminController.js";
// import { sendToLawDepartment } from "../controllers/requestController.js";
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.get("/logout", logout);

// Protected routes (require JWT token)
router.use(protectAdmin);

// Admin self-management
router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/me/password", updateMyPassword);
router.patch("/me/photo", upload.single("photo"), uploadProfilePhoto);
router.patch("/me/cover-photo", upload.single("coverPhoto"), uploadCoverPhoto);

// Admin management (restricted to general-director)
router.post("/signup", restrictToAdmin("general-director"), signup);
router.get("/", restrictToAdmin("general-director"), getAllAdmins);

// Data access (partnership-division and general-director)
const pdAndGdRoles = ["partnership-division", "general-director"];

router.get("/requests", restrictToAdmin(...pdAndGdRoles), getAllRequests);
router.get("/users", restrictToAdmin(...pdAndGdRoles), getAllUsers);
router.get("/users/external", restrictToAdmin(...pdAndGdRoles), getAllExternalUsers);
router.get("/users/internal", restrictToAdmin(...pdAndGdRoles), getAllInternalUsers);
router.get("/users/internal/:userId/requests", restrictToAdmin(...pdAndGdRoles), getInternalUserRequests);
router.get("/users/external/:userId/requests", restrictToAdmin(...pdAndGdRoles), getExternalUserRequests);
router.patch('/:requestId/send-to-law', 
  restrictToAdmin('partnership-division'), 
  sendToLawDepartment
);
// Optional future routes:
// router.post("/send-to-law", restrictToAdmin("partnership-division"), sendToLawDepartment);
// router.post("/review-request/:requestId", restrictToAdmin("law-department"), reviewRequest);

export default router;
