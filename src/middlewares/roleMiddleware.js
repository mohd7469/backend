import { ErrorResponse } from '../utils/index.js';

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ErrorResponse('Forbidden', 403));
  }
  next();
};