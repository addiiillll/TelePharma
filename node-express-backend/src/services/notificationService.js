const Notification = require('../models/Notification');

const notificationService = {
  // Create notification in database
  createNotification: async (recipientType, recipientId, type, title, message, sessionId) => {
    try {
      const notification = new Notification({
        recipientType,
        recipientId,
        type,
        title,
        message,
        sessionId
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  },

  // Send push notification (mock implementation)
  sendPushNotification: async (recipientId, title, message) => {
    try {
      // Mock push notification - in production, use FCM, OneSignal, etc.
      console.log(`📱 PUSH NOTIFICATION to ${recipientId}:`);
      console.log(`   Title: ${title}`);
      console.log(`   Message: ${message}`);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return { success: false };
    }
  },

  // Send notification (both DB and push)
  sendNotification: async (recipientType, recipientId, type, title, message, sessionId) => {
    try {
      // Save to database
      const dbNotification = await notificationService.createNotification(
        recipientType, recipientId, type, title, message, sessionId
      );

      // Send push notification
      await notificationService.sendPushNotification(recipientId, title, message);

      return dbNotification;
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  },

  // Get notifications for recipient with pagination
  getNotifications: async (recipientType, recipientId, skip = 0, limit = 10) => {
    try {
      const notifications = await Notification.find({
        recipientType,
        recipientId
      }).sort({ createdAt: -1 }).skip(skip).limit(limit);
      
      return notifications;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }
};

module.exports = notificationService;