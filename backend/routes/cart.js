import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    validateCart,
    applyDiscount,
    removeDiscount
} from "../controllers/cartController.js";
import { authenticate, checkApproval } from "../middleware/auth.js";
import { cartValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticate, checkApproval);

router.get("/", getCart);
router.post("/items", cartValidation.addItem, validate, addToCart);
router.put("/items/:productId", cartValidation.updateQuantity, validate, updateCartItem);
router.delete("/items/:productId", removeFromCart);
router.delete("/", clearCart);
router.post("/validate", validateCart);
router.post("/discount", applyDiscount);
router.delete("/discount", removeDiscount);

export default router;
