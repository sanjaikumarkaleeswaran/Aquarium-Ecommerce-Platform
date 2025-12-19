// Error handler middleware for the entire application

// Custom error class
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Not found error handler
export const notFound = (req, res, next) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error("Error:", {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found with id: ${err.value}`;
        error = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists.`;
        error = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = messages.join(". ");
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token. Please log in again.";
        error = new AppError(message, 401);
    }

    if (err.name === "TokenExpiredError") {
        const message = "Your token has expired. Please log in again.";
        error = new AppError(message, 401);
    }

    // Send error response
    res.status(error.statusCode || err.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? {
            statusCode: error.statusCode || err.statusCode || 500,
            stack: err.stack,
            details: err
        } : undefined
    });
};

// Async handler to wrap async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error formatter
export const formatValidationErrors = (errors) => {
    return errors.array().reduce((acc, error) => {
        acc[error.param] = error.msg;
        return acc;
    }, {});
};

export default {
    AppError,
    notFound,
    errorHandler,
    asyncHandler,
    formatValidationErrors
};
