import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    enum: {
      values: ["customer", "retailer", "wholesaler", "admin"],
      message: "{VALUE} is not a valid role"
    },
    required: [true, "Role is required"]
  },

  // Approval System (for retailers and wholesalers)
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: function () {
      // Auto-approve customers and admins
      return (this.role === "customer" || this.role === "admin") ? "approved" : "pending";
    }
  },
  isApproved: {
    type: Boolean,
    default: function () {
      // Auto-approve customers and admins
      return this.role === "customer" || this.role === "admin";
    }
  },
  rejectionReason: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approvedAt: {
    type: Date
  },

  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  // Business Information (for retailers and wholesalers)
  businessName: {
    type: String,
    trim: true
  },
  businessLicense: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    trim: true
  },
  taxId: {
    type: String,
    trim: true
  },

  // Retailer Specific Fields
  storeName: {
    type: String,
    trim: true
  },
  storeAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  storeDescription: {
    type: String
  },

  // Wholesaler Specific Fields
  warehouseLocation: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1
  },
  companyDescription: {
    type: String
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },

  // Profile Image
  profileImage: {
    type: String
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Index for faster queries

userSchema.index({ role: 1, approvalStatus: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;