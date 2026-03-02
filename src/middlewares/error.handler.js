import { ErrorResponse } from '../utils/index.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, error: 'Server Error' });
};
