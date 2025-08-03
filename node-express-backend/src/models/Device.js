const mongoose = require('mongoose');
const crypto = require('crypto');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true, unique: true },
  pharmacyName: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String }
  },
  isActive: { type: Boolean, default: true },
  lastPing: { type: Date, default: Date.now }
}, { timestamps: true });

deviceSchema.pre('save', function(next) {
  if (this.isNew && !this.apiKey) {
    this.apiKey = crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Device', deviceSchema);