import AppError from './appError.js';

export const validatePartnerPrivileges = (privileges) => {
  if (!privileges || typeof privileges !== 'object') {
    throw new AppError('Invalid privileges format', 400);
  }

  const requiredRoles = ['director', 'partnership-division', 'law-service', 'law-research'];
  
  for (const role of requiredRoles) {
    if (typeof privileges[role] !== 'boolean') {
      throw new AppError(`Invalid privilege value for role: ${role}`, 400);
    }
  }

  return true;
};

export const validatePartnerId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new AppError('Invalid partner ID', 400);
  }
  return true;
};

export const validatePartnershipType = (type) => {
  const validTypes = ['operational', 'strategic', 'tactical', 'project'];
  if (!type || !validTypes.includes(type)) {
    throw new AppError('Invalid partnership type', 400);
  }
  return true;
};

export const validateDuration = (duration) => {
  if (!duration) {
    throw new AppError('Duration is required', 400);
  }

  if (typeof duration === 'object') {
    if (!duration.type || !duration.value) {
      throw new AppError('Invalid duration format', 400);
    }
    if (!['months', 'years'].includes(duration.type)) {
      throw new AppError('Duration type must be either months or years', 400);
    }
    if (typeof duration.value !== 'number' || duration.value <= 0) {
      throw new AppError('Duration value must be a positive number', 400);
    }
  } else if (typeof duration !== 'number' || duration <= 0) {
    throw new AppError('Duration must be a positive number', 400);
  }

  return true;
}; 