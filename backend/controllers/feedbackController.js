import Feedback from '../models/Feedback.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Create new feedback
export const createFeedback = catchAsync(async (req, res) => {
  const feedback = await Feedback.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: {
      feedback
    }
  });
});

// Get all feedback (admin only)
export const getAllFeedback = catchAsync(async (req, res) => {
  const feedback = await Feedback.find()
    .populate('user', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      feedback
    }
  });
});

// Get feedback statistics
export const getFeedbackStats = catchAsync(async (req, res) => {
  const stats = await Feedback.aggregate([
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const totalFeedback = await Feedback.countDocuments();
  const averageRating = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      totalFeedback,
      averageRating: averageRating[0]?.average || 0
    }
  });
}); 