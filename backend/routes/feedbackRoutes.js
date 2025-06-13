import express from 'express';
import { createFeedback } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (requires authentication)
router.post('/', protect, createFeedback);

export default router; 