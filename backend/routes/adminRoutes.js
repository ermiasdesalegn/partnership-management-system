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
  getReviewedRequestsByAdmin
} from "../controllers/adminController.js";
import {addFeedbackAttachment, addRequestAttachment} from "../controllers/requestController.js"
import {forwardToGeneralDirector} from "../controllers/forwardToGeneralDirector.js"
import {generalDirectorDecision,getRequestsForGeneralDirector} from "../controllers/generalDirectorDecision.js"
import {lawServiceReviewRequest, lawResearchReviewRequest, getLawRelatedRequests, getLawRelatedRequestsForPartnership} from "../controllers/lawDepartmentReviewRequest.js"
import {partnershipReviewRequest,getPartnershipReviewedRequests,getApprovedRequestsForPartnershipDivision,getDisapprovedRequestsForLawDepartment,getPendingRequests} from "../controllers/partnershipReviewRequest.js"
import { protectAdmin, restrictToAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";   
import { getDirectorRequests, directorReview } from "../controllers/directorController.js";

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

// Admin management
router.get("/", restrictToAdmin("general-director"), getAllAdmins);
router.post("/signup", signup);

// Data access (partnership-division, director and general-director)
const pdAndGdRoles = ["partnership-division", "law-service", "law-research", "director", "general-director"];

router.get("/requests", restrictToAdmin(...pdAndGdRoles), getAllRequests);
router.get("/requestsRelated", restrictToAdmin("partnership-division", "law-service", "law-research", "director", "general-director"), getRequestsByRole);
router.get("/requests/:id", protectAdmin, restrictToAdmin("partnership-division", "law-service", "law-research", "director", "general-director"), getSingleRequestInRoleList);

router.get("/users", restrictToAdmin(...pdAndGdRoles), getAllUsers);
router.get("/users/external", restrictToAdmin(...pdAndGdRoles), getAllExternalUsers);
router.get("/users/internal", restrictToAdmin(...pdAndGdRoles), getAllInternalUsers);
router.get("/users/internal/:userId/requests", restrictToAdmin(...pdAndGdRoles), getInternalUserRequests);
router.get("/users/external/:userId/requests", restrictToAdmin(...pdAndGdRoles), getExternalUserRequests);

// Partnership Division reviews
router.post(
  "/review/partnership",
  protectAdmin,
  restrictToAdmin("partnership-division", "director"),
  upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "feedbackAttachments", maxCount: 5 }
  ]),
  partnershipReviewRequest
);

// Law department reviews law-related requests
router.post(
  "/review/law-service",
  protectAdmin,
  restrictToAdmin("law-service", "director"),
  upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "feedbackAttachments", maxCount: 5 }
  ]),
  lawServiceReviewRequest
);

router.post(
  "/review/law-research",
  protectAdmin,
  restrictToAdmin("law-research", "director"),
  upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "feedbackAttachments", maxCount: 5 }
  ]),
  lawResearchReviewRequest
);

// Partnership Division forwards to General Director (after law review)
router.post(
  "/forward/general-director",
  protectAdmin,
  restrictToAdmin("partnership-division", "director"),
  forwardToGeneralDirector
);

// General Director final decision
router.post(
  "/review/general-director",
  protectAdmin,
  restrictToAdmin("general-director", "director"),
  upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "feedbackAttachments", maxCount: 5 }
  ]),
  generalDirectorDecision
);

router.get("/law-service-requests", protectAdmin, restrictToAdmin("law-service", "director"), getLawRelatedRequests);
router.get("/law-research-requests", protectAdmin, restrictToAdmin("law-research", "director"), getLawRelatedRequests);
router.get("/pending-requests", protectAdmin, restrictToAdmin("partnership-division", "director"), getPendingRequests);
router.get('/my-reviewed-requests', protectAdmin, restrictToAdmin('partnership-division', 'law-service', 'law-research', 'director', 'general-director'), getReviewedRequestsByAdmin);

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
router.get("/approved-requests", protectAdmin, restrictToAdmin("partnership-division"), getApprovedRequestsForPartnershipDivision);

// Law Department: Get disapproved requests
router.get("/disapproved-requests", protectAdmin, restrictToAdmin("law-service", "law-research"), getDisapprovedRequestsForLawDepartment);

// Get all requests reviewed by partnership division (regardless of current stage)
router.get(
  "/partnership-reviewed",
  protectAdmin,
  restrictToAdmin("partnership-division"),
  getPartnershipReviewedRequests
);

// Partnership Division: Get law-related requests
router.get(
  "/partnership/law-requests",
  protectAdmin,
  restrictToAdmin("partnership-division"),
  getLawRelatedRequestsForPartnership
);

// Partnership Division: Forward approved law-related request to General Director
router.post(
  "/partnership/forward-to-general-director",
  protectAdmin,
  restrictToAdmin("partnership-division"),
  forwardToGeneralDirector
);

// Director routes
router.get("/director/requests", protectAdmin, restrictToAdmin("director"), getDirectorRequests);
router.get("/director/all-requests", protectAdmin, restrictToAdmin("director"), getAllRequests);
router.post(
  "/director/review",
  protectAdmin,
  restrictToAdmin("director"),
  upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "feedbackAttachments", maxCount: 5 }
  ]),
  directorReview
);

export default router;
