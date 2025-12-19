import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    // User who receives the notification
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },

    // Notification Type
    type: {
        type: String,
        enum: [
            "order",           // Order-related notifications
            "approval",        // Account approval/rejection
            "payment",         // Payment confirmations
            "shipping",        // Shipping updates
            "product",         // Product updates
            "stock",           // Stock alerts
            "system",          // System announcements
            "message"          // Direct messages
        ],
        required: true
    },

    // Notification Content
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },

    // Related Entity (optional)
    relatedEntity: {
        entityType: {
            type: String,
            enum: ["Order", "Product", "RetailerProduct", "User", "Cart"]
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId
        }
    },

    // Action Link
    link: {
        type: String // URL to navigate to when notification is clicked
    },
    actionText: {
        type: String // Text for action button (e.g., "View Order", "Approve Now")
    },

    // Priority
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },

    // Status
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },

    // Icon/Image
    icon: {
        type: String // Icon name or URL
    },

    // Metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed // Additional data specific to notification type
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date // Optional expiration date for time-sensitive notifications
    }
}, {
    timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired notifications

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
    this.isRead = true;
    this.readAt = Date.now();
    await this.save();
    return this;
};

// Method to mark as unread
notificationSchema.methods.markAsUnread = async function () {
    this.isRead = false;
    this.readAt = null;
    await this.save();
    return this;
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function (userId) {
    const result = await this.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true, readAt: Date.now() } }
    );
    return result;
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function (userId) {
    const count = await this.countDocuments({ user: userId, isRead: false });
    return count;
};

// Static method to create notification
notificationSchema.statics.createNotification = async function (notificationData) {
    const notification = new this(notificationData);
    await notification.save();

    // TODO: Emit socket event for real-time notification
    // io.to(notificationData.user.toString()).emit('notification', notification);

    return notification;
};

// Static method to create bulk notifications
notificationSchema.statics.createBulkNotifications = async function (userIds, notificationData) {
    const notifications = userIds.map(userId => ({
        ...notificationData,
        user: userId
    }));

    const result = await this.insertMany(notifications);

    // TODO: Emit socket events for real-time notifications

    return result;
};

// Static method to delete old notifications
notificationSchema.statics.deleteOldNotifications = async function (daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.deleteMany({
        createdAt: { $lt: cutoffDate },
        isRead: true
    });

    return result;
};

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
