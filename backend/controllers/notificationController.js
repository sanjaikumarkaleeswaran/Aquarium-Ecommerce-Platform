import Notification from "../models/Notification.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
    const { isRead, type, page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };

    if (isRead !== undefined) filter.isRead = isRead === "true";
    if (type) filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.json({
        success: true,
        count: notifications.length,
        total,
        unreadCount,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        notifications
    });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.getUnreadCount(req.user._id);

    res.json({
        success: true,
        unreadCount: count
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found"
        });
    }

    // Check ownership
    if (notification.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You don't have permission to access this notification"
        });
    }

    await notification.markAsRead();

    res.json({
        success: true,
        message: "Notification marked as read",
        notification
    });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
    const result = await Notification.markAllAsRead(req.user._id);

    res.json({
        success: true,
        message: "All notifications marked as read",
        modifiedCount: result.modifiedCount
    });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found"
        });
    }

    // Check ownership
    if (notification.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "You don't have permission to delete this notification"
        });
    }

    await notification.deleteOne();

    res.json({
        success: true,
        message: "Notification deleted"
    });
});

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
export const clearReadNotifications = asyncHandler(async (req, res) => {
    const result = await Notification.deleteMany({
        user: req.user._id,
        isRead: true
    });

    res.json({
        success: true,
        message: "Read notifications cleared",
        deletedCount: result.deletedCount
    });
});

export default {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications
};
