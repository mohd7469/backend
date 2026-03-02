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

export default ErrorResponse;
