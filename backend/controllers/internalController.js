// const Request = require('../models/Request');
// const asyncHandler = require('../middleware/async');

// // @desc    Get dashboard statistics and recent requests
// // @route   GET /api/v1/internal/dashboard
// // @access  Private
// exports.getDashboardData = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   // Get statistics
//   const stats = {
//     totalRequests: await Request.countDocuments({ userRef: userId }),
//     pendingRequests: await Request.countDocuments({ 
//       userRef: userId,
//       status: 'pending'
//     }),
//     completedRequests: await Request.countDocuments({ 
//       userRef: userId,
//       status: 'completed'
//     }),
//     rejectedRequests: await Request.countDocuments({ 
//       userRef: userId,
//       status: 'rejected'
//     })
//   };

//   // Get recent requests
//   const recentRequests = await Request.find({ userRef: userId })
//     .sort({ createdAt: -1 })
//     .limit(5)
//     .select('title status createdAt');

//   res.status(200).json({
//     success: true,
//     data: {
//       stats,
//       recentRequests
//     }
//   });
// }); 