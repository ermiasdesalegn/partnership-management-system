import express from 'express';
import { getOverallPartnershipStatistics, getSignedPartnersActivityStatistics } from '../controllers/partnershipStatisticsController.js';
import { protectAdmin, restrictToAdmin } from '../middleware/authMiddleware.js';
import Partner from '../models/Partners.js';
import PartnershipActivity from '../models/PartnershipActivity.js';

const router = express.Router();

// Test route to check database connection
router.get('/test', async (req, res) => {
  try {
    const partners = await Partner.find();
    const activities = await PartnershipActivity.find();
    res.status(200).json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        partnerCount: partners.length,
        partners: partners.map(p => ({
          id: p._id,
          name: p.companyName,
          type: p.partnershipRequestType,
          isSigned: p.isSigned
        })),
        activityCount: activities.length,
        activities: activities.map(a => ({
          id: a._id,
          partnerId: a.partnerRef,
          title: a.title,
          status: a.status,
          assignedTo: a.assignedTo
        }))
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Protect all routes
router.use(protectAdmin);

// Get overall partnership statistics (admin only)
router.get('/overall', restrictToAdmin('partnership-division', 'general-director', 'super-admin'), getOverallPartnershipStatistics);

// Get signed partners activity statistics (admin only)
router.get('/signed-partners', restrictToAdmin('partnership-division', 'general-director', 'super-admin'), getSignedPartnersActivityStatistics);

export default router; 