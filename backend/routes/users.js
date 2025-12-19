import express from "express";
import {
  getAllRetailers,
  getAllWholesalers,
  getUserProfile
} from "../controllers/userController.js";
import { authenticate, wholesalerOnly, retailerOnly } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.get("/retailers", authenticate, wholesalerOnly, getAllRetailers);
router.get("/wholesalers", authenticate, retailerOnly, getAllWholesalers);
router.get("/:id", authenticate, getUserProfile);

export default router;