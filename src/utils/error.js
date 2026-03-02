const ErrorResponse = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.name = 'ErrorResponse';
  Error.captureStackTrace(error, ErrorResponse);
  return error;
};

// Common HTTP error helpers for consistent error responses
export const errors = {
  badRequest: (message = 'Bad Request') => ErrorResponse(message, 400),
  unauthorized: (message = 'Unauthorized') => ErrorResponse(message, 401),
  forbidden: (message = 'Forbidden') => ErrorResponse(message, 403),
  notFound: (message = 'Not Found') => ErrorResponse(message, 404),
  conflict: (message = 'Conflict') => ErrorResponse(message, 409),
  unprocessable: (message = 'Unprocessable Entity') => ErrorResponse(message, 422),
  serverError: (message = 'Internal Server Error') => ErrorResponse(message, 500),
};


// centralized middleware for formatting and sending errors
export const errorHandler = (err, req, res, next) => {
  // default status
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}: ${message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.APP_ENV !== 'production' && { stack: err.stack }),
  });
};

export default ErrorResponse;
