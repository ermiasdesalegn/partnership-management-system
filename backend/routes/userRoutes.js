// routes/userRoutes.js
import express from "express";
import { 
  registerUser, 
  loginUser,
  googleSignup,
  createRequest,
  // logout,
  getMe,
  // updateMe,
  // updateMyPassword,
  // deleteMe,
  getRequestStatus,
  getRequestById
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";    

const router = express.Router();

// Public routes
router.post("/signup", registerUser);
router.post("/google-signup", googleSignup);
router.post("/login", loginUser);
// router.get("/logout", logout);

// Protected routes
router.use(protect);
router.get("/me", getMe);
router.post("/requests", upload.array('files'), createRequest);
router.get("/requests/status", getRequestStatus);
router.get("/requests/:id", getRequestById);

export default router;
