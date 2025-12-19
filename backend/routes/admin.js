import express from "express";
import {
    getPendingApprovals,
    approveUser,
    rejectUser,
    getAllUsers,
    getUserById,
    deactivateUser,
    activateUser,
    getDashboardStats,
    getAllOrders,
    getAllProducts,
    deleteUser,
    updateUser
} from "../controllers/adminController.js";
import { authenticate, adminOnly } from "../middleware/auth.js";
import { adminValidation, idValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate, adminOnly);

// Approval routes
router.get("/approvals/pending", getPendingApprovals);
router.post("/approvals/:userId/approve", adminValidation.approveUser, validate, approveUser);
router.post("/approvals/:userId/reject", adminValidation.rejectUser, validate, rejectUser);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId", updateUser); // Update user
router.delete("/users/:userId", deleteUser); // Delete user
router.put("/users/:userId/deactivate", deactivateUser);
router.put("/users/:userId/activate", activateUser);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/orders", getAllOrders);
router.get("/products", getAllProducts);

export default router;
