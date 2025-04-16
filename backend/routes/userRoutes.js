import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";
// import {addFeedbackAttachment, addRequestAttachment} from "../controllers/requestController.js"
// import {forwardToGeneralDirector} from "../controllers/forwardToGeneralDirector.js"
// import {generalDirectorDecision,getRequestsForGeneralDirector} from "../controllers/generalDirectorDecision.js"
// import {lawDepartmentReviewRequest,getLawRelatedRequests} from "../controllers/lawDepartmentReviewRequest.js"
// import {partnershipReviewRequest,getPartnershipReviewedRequests,getApprovedRequestsForPartnershipDivision,getDisapprovedRequestsForLawDepartment,getPendingRequests} from "../controllers/partnershipReviewRequest.js"
// import {getRequestsByRole} from "../controllers/requestController.js"
// import { sendToLawDepartment } from "../controllers/requestController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
// import {upload} from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/login",  loginUser);
router.post("/signup", registerUser);
router.use(protect);

// Protected routes (require JWT token)

export default router;
