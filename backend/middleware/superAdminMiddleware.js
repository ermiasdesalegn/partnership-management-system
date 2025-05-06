import AppError from '../utils/appError.js';

export const restrictToSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
}; 