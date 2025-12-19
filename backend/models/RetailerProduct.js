import mongoose from "mongoose";

const retailerProductSchema = new mongoose.Schema({
    // Source Product Information
    originalProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Original product reference is required"]
    },
    wholesaler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Wholesaler reference is required"]
    },

    // Retailer Information
    retailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Retailer reference is required"]
    },

    // Product Details (copied from original product for faster access)
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    mainImage: {
        type: String
    },
    sku: {
        type: String
    },

    // Pricing
    purchasePrice: {
        type: Number,
        required: [true, "Purchase price is required"],
        min: [0, "Price cannot be negative"]
    },
    retailPrice: {
        type: Number,
        required: [true, "Retail price is required"],
        min: [0, "Price cannot be negative"]
    },
    profitMargin: {
        type: Number,
        default: 0
    },
    profitPercentage: {
        type: Number,
        default: 0
    },

    // Stock Management
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },

    // Purchase Information
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    purchaseOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    initialQuantity: {
        type: Number,
        required: true
    },

    // Product Specifications (copied from original)
    specifications: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: String
        },
        fishType: String,
        temperament: String,
        tankSize: String,
        waterParameters: {
            ph: String,
            temperature: String,
            hardness: String
        },
        medicineType: String,
        dosage: String,
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

    // Statistics
    viewCount: {
        type: Number,
        default: 0
    },
    orderCount: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    totalProfit: {
        type: Number,
        default: 0
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

// Indexes
retailerProductSchema.index({ retailer: 1, isActive: 1 });
retailerProductSchema.index({ originalProduct: 1 });
retailerProductSchema.index({ category: 1, isActive: 1 });
retailerProductSchema.index({ name: "text", description: "text" });

// Virtual for checking if stock is low
retailerProductSchema.virtual("isLowStock").get(function () {
    return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Virtual for checking if out of stock
retailerProductSchema.virtual("isOutOfStock").get(function () {
    return this.stock === 0;
});

// Pre-save middleware to calculate profit
retailerProductSchema.pre("save", function (next) {
    // Calculate profit margin and percentage
    if (this.retailPrice && this.purchasePrice) {
        this.profitMargin = this.retailPrice - this.purchasePrice;
        this.profitPercentage = ((this.profitMargin / this.purchasePrice) * 100).toFixed(2);
    }

    // Set main image
    if (this.images && this.images.length > 0 && !this.mainImage) {
        this.mainImage = this.images[0];
    }

    next();
});

// Method to increment view count
retailerProductSchema.methods.incrementViewCount = async function () {
    this.viewCount += 1;
    await this.save();
};

// Method to decrease stock after sale
retailerProductSchema.methods.decreaseStock = async function (quantity) {
    if (this.stock < quantity) {
        throw new Error("Insufficient stock");
    }

    this.stock -= quantity;
    this.orderCount += 1;
    this.totalSales += quantity;
    this.totalRevenue += (this.retailPrice * quantity);
    this.totalProfit += (this.profitMargin * quantity);

    await this.save();
};

// Method to increase stock (when order is cancelled)
retailerProductSchema.methods.increaseStock = async function (quantity, revenue = 0, profit = 0) {
    this.stock += quantity;
    this.totalSales -= quantity;
    this.totalRevenue -= revenue;
    this.totalProfit -= profit;

    await this.save();
};

// Method to update retail price
retailerProductSchema.methods.updateRetailPrice = async function (newPrice) {
    this.retailPrice = newPrice;
    this.profitMargin = newPrice - this.purchasePrice;
    this.profitPercentage = ((this.profitMargin / this.purchasePrice) * 100).toFixed(2);

    await this.save();
};

// Method to add stock (when retailer orders more)
retailerProductSchema.methods.addStock = async function (quantity, newPurchasePrice = null) {
    this.stock += quantity;

    // Update purchase price if provided (weighted average)
    if (newPurchasePrice) {
        const totalValue = (this.purchasePrice * this.stock) + (newPurchasePrice * quantity);
        const totalQuantity = this.stock + quantity;
        this.purchasePrice = totalValue / totalQuantity;

        // Recalculate profit
        this.profitMargin = this.retailPrice - this.purchasePrice;
        this.profitPercentage = ((this.profitMargin / this.purchasePrice) * 100).toFixed(2);
    }

    await this.save();
};

const RetailerProduct = mongoose.model("RetailerProduct", retailerProductSchema);

export default RetailerProduct;
