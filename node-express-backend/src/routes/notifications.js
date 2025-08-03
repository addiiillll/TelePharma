const express = require('express');
const notificationService = require('../services/notificationService');
const auth = require('../middleware/auth');
const deviceAuth = require('../middleware/deviceAuth');
const router = express.Router();

// Get doctor notifications with pagination
router.get('/doctor', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const notifications = await notificationService.getNotifications(
      'doctor', 
      req.doctor._id.toString(),
      skip,
      limit
    );
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get device notifications with pagination
router.get('/device', deviceAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const notifications = await notificationService.getNotifications(
      'device', 
      req.device.deviceId,
      skip,
      limit
    );
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;