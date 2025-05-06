import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  loginInternalUser, 
  getDashboardData,
  getMe,
  updateMe,
  getAllRequests
} from '../controllers/internalUserController.js';
import { createRequest, getRequestById } from '../controllers/requestController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.post('/login', loginInternalUser);

// Protected routes
router.get('/dashboard', protect, getDashboardData);
router.get('/requests', protect, getAllRequests);
router.post('/requests', protect, upload.array('files'), createRequest);
router.get('/requests/:id', protect, getRequestById);

// Profile routes
router.get('/profile', protect, getMe);
router.patch('/profile', protect, updateMe);

// Stats route
router.get('/requests/stats', protect, getDashboardData);

export default router; 