// Enum for error codes to ensure consistency
const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
};

// function to create custom error object
export const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  // capturing stack trace only in  non-production environment
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createError);
  }

  return error;
};

// error middleware for centralized error handling
const errorMiddleware = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
  err.message = err.message || "Internal server error";

  // Handle MongoDB CastError (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = createError(message, ERROR_CODES.BAD_REQUEST);
  }

  // Handle JSON Web Token errors
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid, please try again.";
    err = createError(message, ERROR_CODES.UNAUTHORIZED);
  }

  // Handle expired JWT token
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired, please try again.";
    err = createError(message, ERROR_CODES.UNAUTHORIZED);
  }

  // Handle MongoDB duplicate key errors (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate ${field} entered`;
    err = createError(message, ERROR_CODES.CONFLICT);
  }

  // Responding with error details to the client
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorMiddleware };
