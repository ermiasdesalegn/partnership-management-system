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
  getRequestsByRole,
  getSingleRequestInRoleList,
  getReviewedRequestsByAdmin,
  
  // sendToLawDepartment,
  // reviewRequest,
} from "../controllers/adminController.js";
import {addFeedbackAttachment, addRequestAttachment} from "../controllers/requestController.js"
import {forwardToGeneralDirector} from "../controllers/forwardToGeneralDirector.js"
import {generalDirectorDecision,getRequestsForGeneralDirector} from "../controllers/generalDirectorDecision.js"
import {lawDepartmentReviewRequest,getLawRelatedRequests} from "../controllers/lawDepartmentReviewRequest.js"
import {partnershipReviewRequest,getPartnershipReviewedRequests,getApprovedRequestsForPartnershipDivision,getDisapprovedRequestsForLawDepartment,getPendingRequests} from "../controllers/partnershipReviewRequest.js"
// import {getRequestsByRole} from "../controllers/requestController.js"
// import { sendToLawDepartment } from "../controllers/requestController.js";
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import  upload  from "../middleware/upload.js";   

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
router.get("/requestsRelated", restrictToAdmin("partnership-division", "law-department", "general-director"), getRequestsByRole);
router.get("/requests/:id", protectAdmin, restrictToAdmin("partnership-division", "law-department", "general-director"), getSingleRequestInRoleList);

router.get("/users", restrictToAdmin(...pdAndGdRoles), getAllUsers);
router.get("/users/external", restrictToAdmin(...pdAndGdRoles), getAllExternalUsers);
router.get("/users/internal", restrictToAdmin(...pdAndGdRoles), getAllInternalUsers);
router.get("/users/internal/:userId/requests", restrictToAdmin(...pdAndGdRoles), getInternalUserRequests);
router.get("/users/external/:userId/requests", restrictToAdmin(...pdAndGdRoles), getExternalUserRequests);
router.post(
  "/review/partnership",
  protectAdmin,
  restrictToAdmin("partnership-division"),
  upload.single("attachment"),
  partnershipReviewRequest
);

// Law department reviews law-related requests
router.post(
  "/review/law",
  protectAdmin,
  restrictToAdmin("law-department"),
  lawDepartmentReviewRequest
);

// Partnership Division forwards to General Director (after law review)
router.post(
  "/forward/general-director",
  protectAdmin,
  restrictToAdmin("partnership-division"),
  forwardToGeneralDirector
);

// General Director final decision
router.post(
  "/review/general-director",
  protectAdmin,
  restrictToAdmin("general-director"),
  upload.none(),
  generalDirectorDecision
);
router.get("/law-requests", protectAdmin , restrictToAdmin("law-department"), getLawRelatedRequests);
// Partnership Division: Get pending requests to review
router.get("/pending-requests", protectAdmin, restrictToAdmin("partnership-division"), getPendingRequests);
router.get('/my-reviewed-requests', protectAdmin, restrictToAdmin('partnership-division', 'law-department', 'general-director'), getReviewedRequestsByAdmin);
// import { upload } from '../utils/upload';

router.post(
  '/requests:requestId/attachments',
  protectAdmin,
  upload.single('file'),
  addRequestAttachment
);

router.post(
  '/:requestId/approvals/:approvalId/attachments',
  protectAdmin,
  upload.single('file'),
  addFeedbackAttachment
);
// General Director: Get requests for review by the General Director
router.get("/general-director-requests", protectAdmin, restrictToAdmin("general-director"), getRequestsForGeneralDirector);

// Partnership Division: Get approved requests after general director's approval
router.get("/approved-requests", protectAdmin, restrictToAdmin("partnership-division" ), getApprovedRequestsForPartnershipDivision);

// Law Department: Get disapproved requests
router.get("/disapproved-requests", protectAdmin, restrictToAdmin("law-department"), getDisapprovedRequestsForLawDepartment);

// Get all requests reviewed by partnership division (regardless of current stage)
router.get(
  "/partnership-reviewed",
  protectAdmin,
  restrictToAdmin("partnership-division"),
  getPartnershipReviewedRequests
);

// Optional future routes:
// router.post("/send-to-law", restrictToAdmin("partnership-division"), sendToLawDepartment);
// router.post("/review-request/:requestId", restrictToAdmin("law-department"), reviewRequest);

export default router;
