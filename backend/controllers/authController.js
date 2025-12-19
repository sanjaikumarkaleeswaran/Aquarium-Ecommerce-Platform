import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { generateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    businessName,
    businessLicense,
    businessType,
    taxId,
    storeName,
    storeAddress,
    storeDescription,
    warehouseLocation,
    minimumOrderQuantity,
    companyDescription
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists"
    });
  }

  // Create user object
  const userData = {
    name,
    email,
    password,
    role,
    phone,
    address
  };

  // Add role-specific fields
  if (role === "retailer") {
    userData.storeName = storeName;
    userData.storeAddress = storeAddress;
    userData.storeDescription = storeDescription;
    userData.businessName = businessName;
    userData.businessLicense = businessLicense;
    userData.businessType = businessType;
    userData.taxId = taxId;
  }

  if (role === "wholesaler") {
    userData.businessName = businessName;
    userData.businessLicense = businessLicense;
    userData.businessType = businessType;
    userData.taxId = taxId;
    userData.warehouseLocation = warehouseLocation;
    userData.minimumOrderQuantity = minimumOrderQuantity || 1;
    userData.companyDescription = companyDescription;
  }

  // Create user
  const user = await User.create(userData);

  // Generate token
  const token = generateToken(user);

  // Determine if approval is required
  const requiresApproval = role === "retailer" || role === "wholesaler";

  // Create welcome notification
  await Notification.createNotification({
    user: user._id,
    type: "system",
    title: "Welcome to Aquarium Commerce!",
    message: requiresApproval
      ? `Your ${role} account has been created and is pending admin approval. You'll be notified once approved.`
      : "Your account has been created successfully. Start exploring our products!",
    priority: "high",
    icon: "welcome"
  });

  // If requires approval, notify admins
  if (requiresApproval) {
    const admins = await User.find({ role: "admin", isActive: true });
    const adminIds = admins.map(admin => admin._id);

    if (adminIds.length > 0) {
      await Notification.createBulkNotifications(adminIds, {
        type: "approval",
        title: "New User Approval Required",
        message: `New ${role} registration: ${name} (${email})`,
        link: `/admin/approvals`,
        priority: "high",
        icon: "user-check",
        relatedEntity: {
          entityType: "User",
          entityId: user._id
        }
      });
    }
  }

  res.status(201).json({
    success: true,
    message: requiresApproval
      ? `Registration successful! Your ${role} account is pending admin approval.`
      : "Registration successful!",
    user: user.getPublicProfile(),
    token,
    requiresApproval
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support."
      });
    }

    // Check approval status for retailers and wholesalers
    const requiresApproval = (user.role === "retailer" || user.role === "wholesaler") && !user.isApproved;

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: user.getPublicProfile(),
      token,
      requiresApproval,
      approvalStatus: user.approvalStatus,
      rejectionReason: user.rejectionReason
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json({
    success: true,
    user: user.getPublicProfile()
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    address,
    storeName,
    storeAddress,
    storeDescription,
    businessName,
    businessLicense,
    businessType,
    taxId,
    warehouseLocation,
    minimumOrderQuantity,
    companyDescription,
    profileImage
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // Update basic fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (profileImage) user.profileImage = profileImage;

  // Update role-specific fields
  if (user.role === "retailer") {
    if (storeName) user.storeName = storeName;
    if (storeAddress) user.storeAddress = storeAddress;
    if (storeDescription) user.storeDescription = storeDescription;
    if (businessName) user.businessName = businessName;
    if (businessLicense) user.businessLicense = businessLicense;
    if (businessType) user.businessType = businessType;
    if (taxId) user.taxId = taxId;
  }

  if (user.role === "wholesaler") {
    if (businessName) user.businessName = businessName;
    if (businessLicense) user.businessLicense = businessLicense;
    if (businessType) user.businessType = businessType;
    if (taxId) user.taxId = taxId;
    if (warehouseLocation) user.warehouseLocation = warehouseLocation;
    if (minimumOrderQuantity) user.minimumOrderQuantity = minimumOrderQuantity;
    if (companyDescription) user.companyDescription = companyDescription;
  }

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: user.getPublicProfile()
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide current password and new password"
    });
  }

  const user = await User.findById(req.user._id);

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect"
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully"
  });
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // In a JWT-based system, logout is handled client-side by removing the token
  // This endpoint is mainly for logging purposes

  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
};