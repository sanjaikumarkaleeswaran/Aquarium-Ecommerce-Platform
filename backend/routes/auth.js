import express from "express";
import {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    logout
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { userValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.post("/register", userValidation.register, validate, register);
router.post("/signup", userValidation.register, validate, register); // Alias for register
router.post("/login", userValidation.login, validate, login);

// Private routes
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, userValidation.updateProfile, validate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.post("/logout", authenticate, logout);

export default router;