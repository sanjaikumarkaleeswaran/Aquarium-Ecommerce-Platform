import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Get all retailers (for wholesalers)
// @route   GET /api/users/retailers
// @access  Private/Wholesaler
export const getAllRetailers = asyncHandler(async (req, res) => {
  const retailers = await User.find({
    role: "retailer",
    isApproved: true,
    isActive: true
  })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: retailers.length,
    retailers
  });
});

// @desc    Get all wholesalers (for retailers)
// @route   GET /api/users/wholesalers
// @access  Private/Retailer
export const getAllWholesalers = asyncHandler(async (req, res) => {
  const wholesalers = await User.find({
    role: "wholesaler",
    isApproved: true,
    isActive: true
  })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: wholesalers.length,
    wholesalers
  });
});

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.json({
    success: true,
    user
  });
});

export default {
  getAllRetailers,
  getAllWholesalers,
  getUserProfile
};