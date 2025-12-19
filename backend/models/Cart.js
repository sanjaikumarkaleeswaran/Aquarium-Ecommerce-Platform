import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    // User Information
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        unique: true
    },

    // Cart Items
    items: [{
        // Product Reference (can be Product or RetailerProduct)
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "items.productModel"
        },
        productModel: {
            type: String,
            required: true,
            enum: ["Product", "RetailerProduct"]
        },

        // Product Details (cached for performance)
        name: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        category: {
            type: String
        },

        // Pricing
        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Quantity
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },

        // Subtotal
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        // Seller Information
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sellerName: {
            type: String
        },
        sellerRole: {
            type: String,
            enum: ["retailer", "wholesaler"],
            required: true
        },

        // Stock validation
        availableStock: {
            type: Number,
            default: 0
        },
        minimumOrderQuantity: {
            type: Number,
            default: 1
        },

        // Added date
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Cart Summary
    totalItems: {
        type: Number,
        default: 0
    },
    totalQuantity: {
        type: Number,
        default: 0
    },
    subtotal: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    taxRate: {
        type: Number,
        default: 0.1 // 10% default tax
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },

    // Discount (if applicable)
    discount: {
        code: String,
        amount: Number,
        percentage: Number
    },

    // Timestamps
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes

cartSchema.index({ "items.product": 1 });

// Pre-save middleware to calculate totals
cartSchema.pre("save", function (next) {
    // Calculate totals
    this.totalItems = this.items.length;
    this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate tax
    this.tax = this.subtotal * this.taxRate;

    // Calculate total (subtotal + tax + shipping - discount)
    let total = this.subtotal + this.tax + this.shippingCost;

    if (this.discount && this.discount.amount) {
        total -= this.discount.amount;
    }

    this.totalAmount = Math.max(0, total); // Ensure non-negative
    this.lastUpdated = Date.now();

    next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function (itemData) {
    // Check if item already exists
    const existingItemIndex = this.items.findIndex(
        item => item.product.toString() === itemData.product.toString() &&
            item.productModel === itemData.productModel
    );

    if (existingItemIndex > -1) {
        // Update quantity
        this.items[existingItemIndex].quantity += itemData.quantity;
        this.items[existingItemIndex].subtotal =
            this.items[existingItemIndex].quantity * this.items[existingItemIndex].price;
    } else {
        // Add new item
        const newItem = {
            ...itemData,
            subtotal: itemData.price * itemData.quantity,
            addedAt: Date.now()
        };
        this.items.push(newItem);
    }

    await this.save();
    return this;
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = async function (productId, productModel, quantity) {
    const itemIndex = this.items.findIndex(
        item => item.product.toString() === productId.toString() &&
            item.productModel === productModel
    );

    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        this.items.splice(itemIndex, 1);
    } else {
        // Update quantity and subtotal
        this.items[itemIndex].quantity = quantity;
        this.items[itemIndex].subtotal = this.items[itemIndex].price * quantity;
    }

    await this.save();
    return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId, productModel) {
    this.items = this.items.filter(
        item => !(item.product.toString() === productId.toString() &&
            item.productModel === productModel)
    );

    await this.save();
    return this;
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
    this.items = [];
    this.discount = undefined;
    await this.save();
    return this;
};

// Method to apply discount
cartSchema.methods.applyDiscount = async function (discountCode, amount, percentage) {
    this.discount = {
        code: discountCode,
        amount: amount || (this.subtotal * (percentage / 100)),
        percentage: percentage
    };

    await this.save();
    return this;
};

// Method to remove discount
cartSchema.methods.removeDiscount = async function () {
    this.discount = undefined;
    await this.save();
    return this;
};

// Method to validate cart items (check stock availability)
cartSchema.methods.validateCart = async function () {
    const Product = mongoose.model("Product");
    const RetailerProduct = mongoose.model("RetailerProduct");

    const validationErrors = [];

    for (const item of this.items) {
        let product;

        if (item.productModel === "Product") {
            product = await Product.findById(item.product);
        } else {
            product = await RetailerProduct.findById(item.product);
        }

        if (!product) {
            validationErrors.push({
                item: item.name,
                error: "Product no longer available"
            });
            continue;
        }

        if (!product.isActive) {
            validationErrors.push({
                item: item.name,
                error: "Product is no longer active"
            });
            continue;
        }

        if (product.stock < item.quantity) {
            validationErrors.push({
                item: item.name,
                error: `Only ${product.stock} items available`,
                availableStock: product.stock
            });
            continue;
        }

        if (item.quantity < product.minimumOrderQuantity) {
            validationErrors.push({
                item: item.name,
                error: `Minimum order quantity is ${product.minimumOrderQuantity}`,
                minimumOrderQuantity: product.minimumOrderQuantity
            });
        }
    }

    return {
        isValid: validationErrors.length === 0,
        errors: validationErrors
    };
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
