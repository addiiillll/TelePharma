const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  deviceId: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  symptoms: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['waiting', 'active', 'completed', 'cancelled'], 
    default: 'waiting' 
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);