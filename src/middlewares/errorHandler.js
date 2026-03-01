import { ErrorResponse } from '../utils/index.js';

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';
  // Log error for debugging
  console.error(err);
  res.status(status).json({ success: false, error: message });
};
