import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // Order Number (unique identifier)
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },

  // Parties Involved
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Buyer is required"]
  },
  buyerName: {
    type: String,
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  buyerRole: {
    type: String,
    enum: ["customer", "retailer"],
    required: true
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Seller is required"]
  },
  sellerName: {
    type: String,
    required: true
  },
  sellerEmail: {
    type: String,
    required: true
  },
  sellerRole: {
    type: String,
    enum: ["retailer", "wholesaler"],
    required: true
  },

  // Order Items
  items: [{
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
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    image: {
      type: String
    },
    sku: {
      type: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  }],

  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 0.1
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    code: String,
    amount: {
      type: Number,
      default: 0
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Order Status
  status: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
    default: "pending"
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }],

  // Shipping Information
  shippingAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: "India"
    }
  },
  trackingNumber: {
    type: String
  },
  shippingCarrier: {
    type: String
  },

  // Payment Information
  paymentMethod: {
    type: String,
    enum: ["credit-card", "debit-card", "paypal", "bank-transfer", "cash-on-delivery", "stripe"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  paymentIntentId: {
    type: String // Stripe payment intent ID
  },
  transactionId: {
    type: String
  },
  paidAt: {
    type: Date
  },

  // Important Dates
  orderDate: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  processingAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  estimatedDeliveryDate: {
    type: Date
  },

  // Notes and Communication
  buyerNotes: {
    type: String
  },
  sellerNotes: {
    type: String
  },
  cancellationReason: {
    type: String
  },
  refundReason: {
    type: String
  },

  // Internal Flags
  isReviewed: {
    type: Boolean,
    default: false
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  isInventoryAdded: {
    type: Boolean,
    default: false
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
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ seller: 1, status: 1 });
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ paymentStatus: 1 });

// Pre-validate middleware to generate order number before validation checking
orderSchema.pre("validate", async function (next) {
  if (!this.orderNumber) {
    // Generate unique order number: ORD-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(10000 + Math.random() * 90000);
    this.orderNumber = `ORD-${dateStr}-${random}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function (newStatus, note = "", updatedBy = null) {
  this.status = newStatus;

  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: Date.now(),
    note: note,
    updatedBy: updatedBy
  });

  // Update relevant date fields
  const now = Date.now();
  switch (newStatus) {
    case "confirmed":
      this.confirmedAt = now;
      break;
    case "processing":
      this.processingAt = now;
      break;
    case "shipped":
      this.shippedAt = now;
      // Set estimated delivery (7 days from shipping)
      if (!this.estimatedDeliveryDate) {
        this.estimatedDeliveryDate = new Date(now + 7 * 24 * 60 * 60 * 1000);
      }
      break;
    case "delivered":
      this.deliveredAt = now;
      break;
    case "cancelled":
      this.cancelledAt = now;
      break;
  }

  await this.save();
  return this;
};

// Method to mark as paid
orderSchema.methods.markAsPaid = async function (transactionId = "", paymentIntentId = "") {
  this.isPaid = true;
  this.paymentStatus = "completed";
  this.paidAt = Date.now();

  if (transactionId) {
    this.transactionId = transactionId;
  }

  if (paymentIntentId) {
    this.paymentIntentId = paymentIntentId;
  }

  await this.save();
  return this;
};

// Method to cancel order
orderSchema.methods.cancelOrder = async function (reason = "", cancelledBy = null) {
  if (this.status === "delivered") {
    throw new Error("Cannot cancel delivered order");
  }

  this.status = "cancelled";
  this.cancelledAt = Date.now();
  this.cancellationReason = reason;

  this.statusHistory.push({
    status: "cancelled",
    timestamp: Date.now(),
    note: reason,
    updatedBy: cancelledBy
  });

  await this.save();
  return this;
};

// Method to add tracking information
orderSchema.methods.addTracking = async function (trackingNumber, carrier = "") {
  this.trackingNumber = trackingNumber;

  if (carrier) {
    this.shippingCarrier = carrier;
  }

  // Auto-update status to shipped if not already
  if (this.status !== "shipped" && this.status !== "delivered") {
    await this.updateStatus("shipped", `Tracking number: ${trackingNumber}`);
  } else {
    await this.save();
  }

  return this;
};

// Static method to generate order summary
orderSchema.statics.getOrderSummary = async function (userId, role) {
  const query = role === "buyer" ? { buyer: userId } : { seller: userId };

  const summary = await this.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" }
      }
    }
  ]);

  return summary;
};

const Order = mongoose.model("Order", orderSchema);

export default Order;