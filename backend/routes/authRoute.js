import express from "express";
import { registerUser,createFirstAdmin, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/create-first-admin', createFirstAdmin);

export default router;