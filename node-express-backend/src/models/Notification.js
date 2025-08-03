const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientType: { 
    type: String, 
    enum: ['doctor', 'device'], 
    required: true 
  },
  recipientId: { 
    type: String, 
    required: true 
  }, // doctorId or deviceId
  type: { 
    type: String, 
    enum: ['session_request', 'session_accepted', 'session_completed'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  sessionId: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notification', notificationSchema);