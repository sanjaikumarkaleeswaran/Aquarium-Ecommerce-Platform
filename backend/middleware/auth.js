import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify JWT token and authenticate user
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Invalid token format."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_12345");

        // Get user from database
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Token invalid."
            });
        }

        // Check if user account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact support."
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed.",
            error: error.message
        });
    }
};

// Middleware to check if user has required role(s)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. This resource requires ${roles.join(" or ")} role.`,
                userRole: req.user.role,
                requiredRoles: roles
            });
        }

        next();
    };
};

// Middleware to check if retailer/wholesaler is approved
export const checkApproval = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    // Only check approval for retailers and wholesalers
    if (req.user.role === "retailer" || req.user.role === "wholesaler") {
        if (!req.user.isApproved || req.user.approvalStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Your account is pending admin approval. You cannot perform this action yet.",
                approvalStatus: req.user.approvalStatus,
                rejectionReason: req.user.rejectionReason
            });
        }
    }

    next();
};

// Middleware for admin-only routes
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
            userRole: req.user.role
        });
    }

    next();
};

// Middleware for wholesaler-only routes
export const wholesalerOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "wholesaler") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Wholesaler privileges required.",
            userRole: req.user.role
        });
    }

    next();
};

// Middleware for retailer-only routes
export const retailerOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "retailer") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Retailer privileges required.",
            userRole: req.user.role
        });
    }

    next();
};

// Middleware for customer-only routes
export const customerOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "customer") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Customer privileges required.",
            userRole: req.user.role
        });
    }

    next();
};

// Middleware to check if user owns a resource
export const checkOwnership = (resourceField = "user") => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        // Admin can access everything
        if (req.user.role === "admin") {
            return next();
        }

        // Check if user owns the resource
        const resourceOwnerId = req[resourceField] || req.body[resourceField] || req.params[resourceField];

        if (!resourceOwnerId || resourceOwnerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You don't have permission to access this resource."
            });
        }

        next();
    };
};

// Middleware to generate and attach JWT token
export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        approvalStatus: user.approvalStatus
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret_key_12345", {
        expiresIn: process.env.JWT_EXPIRE || "30d"
    });

    return token;
};

// Middleware to refresh token
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token required."
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.id).select("-password");

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token."
            });
        }

        // Generate new access token
        const newToken = generateToken(user);

        res.json({
            success: true,
            token: newToken,
            user: user.getPublicProfile()
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token."
        });
    }
};

export default {
    authenticate,
    authorize,
    checkApproval,
    adminOnly,
    wholesalerOnly,
    retailerOnly,
    customerOnly,
    checkOwnership,
    generateToken,
    refreshToken
};
