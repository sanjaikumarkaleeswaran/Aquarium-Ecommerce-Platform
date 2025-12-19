import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: [
        "Marine Fish",
        "Fresh Water Fish",
        "Tanks",
        "Aquarium Accessories",
        "Fish Food",
        "Medicines",
        "Water Treatment",
        "Decorative Items",
        "Plants",
        "Filters & Pumps"
      ],
      message: "{VALUE} is not a valid category"
    }
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },

  // SKU and Identification
  sku: {
    type: String,
    unique: true,
    sparse: true
  },

  // Pricing (Wholesaler sets these)
  wholesalePrice: {
    type: Number,
    required: [true, "Wholesale price is required"],
    min: [0, "Price cannot be negative"]
  },
  suggestedRetailPrice: {
    type: Number,
    required: [true, "Suggested retail price is required"],
    min: [0, "Price cannot be negative"]
  },

  // Stock Management
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, "Minimum order quantity must be at least 1"]
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },

  // Wholesaler Information
  wholesaler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Wholesaler is required"]
  },
  wholesalerName: {
    type: String
  },

  // Product Images
  images: [{
    type: String
  }],
  mainImage: {
    type: String
  },

  // Product Specifications
  specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["cm", "inch"],
        default: "cm"
      }
    },
    // Fish-specific
    fishType: {
      type: String,
      enum: ["soft", "hard", "marine", "freshwater"]
    },
    temperament: String,
    tankSize: String,
    waterParameters: {
      ph: String,
      temperature: String,
      hardness: String
    },
    // Medicine-specific
    medicineType: {
      type: String,
      enum: ["treatment", "prevention", "supplement"]
    },
    dosage: String,
    // General
    brand: String,
    manufacturer: String
  },

  // Product Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // SEO and Search
  tags: [{
    type: String
  }],
  searchKeywords: [{
    type: String
  }],

  // Statistics
  viewCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
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

// Indexes for better query performance
productSchema.index({ wholesaler: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ wholesalePrice: 1 });
productSchema.index({ stock: 1 });

// Virtual for checking if stock is low
productSchema.virtual("isLowStock").get(function () {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Virtual for checking if out of stock
productSchema.virtual("isOutOfStock").get(function () {
  return this.stock === 0;
});

// Pre-save middleware to set main image
productSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0 && !this.mainImage) {
    this.mainImage = this.images[0];
  }
  next();
});

// Method to increment view count
productSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  await this.save();
};

// Method to update stock after order
productSchema.methods.decreaseStock = async function (quantity) {
  if (this.stock < quantity) {
    throw new Error("Insufficient stock");
  }
  this.stock -= quantity;
  this.orderCount += 1;
  await this.save();
};

// Method to increase stock (when order is cancelled)
productSchema.methods.increaseStock = async function (quantity) {
  this.stock += quantity;
  await this.save();
};

const Product = mongoose.model("Product", productSchema);

export default Product;