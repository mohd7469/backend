export const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] ${err.name || 'Error'}: ${message}`);

  // Send consistent error response - avoid exposing stack traces in production
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.APP_ENV !== 'production' && { stack: err.stack }),
  });
};
