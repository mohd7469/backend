const ErrorResponse = (message, statusCode, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  error.name = 'ErrorResponse';
  Error.captureStackTrace(error, ErrorResponse);
  return error;
};

// Common HTTP error helpers for consistent error responses
export const errors = {
  badRequest: (message = 'Bad Request', details = null) => ErrorResponse(message, 400, details),
  unauthorized: (message = 'Unauthorized', details = null) => ErrorResponse(message, 401, details),
  forbidden: (message = 'Forbidden', details = null) => ErrorResponse(message, 403, details),
  notFound: (message = 'Not Found', details = null) => ErrorResponse(message, 404, details),
  conflict: (message = 'Conflict', details = null) => ErrorResponse(message, 409, details),
  unprocessable: (message = 'Unprocessable Entity', details = null) => ErrorResponse(message, 422, details),
  serverError: (message = 'Internal Server Error', details = null) => ErrorResponse(message, 500, details),
};


// centralized middleware for formatting and sending errors
export const errorHandler = (err, req, res, next) => {
  // default status
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}: ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(details && { details }),
    ...(process.env.APP_ENV !== 'production' && { stack: err.stack }),
  });
};

export default ErrorResponse;
