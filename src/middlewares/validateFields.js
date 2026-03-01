import { ErrorResponse } from '../utils/index.js';

// simple helper to ensure the request body contains the listed fields
export const validateRequiredFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === null);
  if (missing.length > 0) {
    return next(
      new ErrorResponse(`Missing required field(s): ${missing.join(', ')}`, 400)
    );
  }
  next();
};
