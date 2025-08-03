const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  deviceId: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  status: { 
    type: String, 
    enum: ['waiting', 'active', 'completed', 'cancelled'], 
    default: 'waiting' 
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  firebaseRoomId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);