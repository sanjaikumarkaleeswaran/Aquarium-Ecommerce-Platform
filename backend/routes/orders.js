import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  addTracking,
  markAsPaid
} from "../controllers/orderController.js";
import { authenticate, checkApproval } from "../middleware/auth.js";
import { orderValidation, idValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// All order routes require authentication
router.use(authenticate, checkApproval);

router.post("/", orderValidation.create, validate, createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", orderValidation.updateStatus, validate, updateOrderStatus);
router.put("/:id/cancel", cancelOrder);
router.put("/:id/tracking", addTracking);
router.put("/:id/pay", markAsPaid);

export default router;