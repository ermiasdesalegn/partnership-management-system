import express from 'express';
import {
  getAllUsers,
  getAllAdmins,
  createInternalUser,
  removeUser,
  createAdmin,
  removeAdmin,
  setupInternalUserPassword,
  setupAdminPassword,
  getMe
} from '../controllers/superAdminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { restrictToSuperAdmin } from '../middleware/superAdminMiddleware.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/users/setup-password', setupInternalUserPassword);
router.post('/admins/setup-password', setupAdminPassword);

// Protected routes (require authentication)
router.use(protectAdmin);
router.use(restrictToSuperAdmin);

// Get current super admin
router.get('/me', getMe);

// User management routes
router.get('/users', getAllUsers);
router.post('/users/internal', createInternalUser);
router.delete('/users/:userId', removeUser);

// Admin management routes
router.get('/admins', getAllAdmins);
router.post('/admins', createAdmin);
router.delete('/admins/:adminId', removeAdmin);

export default router; 