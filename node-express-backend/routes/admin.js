const express = require('express');
const Doctor = require('../models/Doctor');
const Session = require('../models/Session');
const Device = require('../models/Device');
const router = express.Router();

// Admin Dashboard Data
router.get('/dashboard', async (req, res) => {
  try {
    const [
      onlineDoctors,
      activeSessions,
      activeDevices,
      totalSessions,
      completedSessions
    ] = await Promise.all([
      Doctor.find({ isOnline: true }).select('name specialization isAvailable'),
      Session.find({ status: 'active' }).populate('doctorId', 'name specialization'),
      Device.find({ isActive: true }),
      Session.countDocuments(),
      Session.countDocuments({ status: 'completed' })
    ]);

    const deviceLocations = activeDevices.map(device => ({
      id: device.deviceId,
      name: device.pharmacyName,
      lat: device.location.latitude,
      lng: device.location.longitude,
      address: device.location.address,
      lastPing: device.lastPing
    }));

    res.json({
      stats: {
        onlineDoctors: onlineDoctors.length,
        activeSessions: activeSessions.length,
        activeDevices: activeDevices.length,
        totalSessions,
        completedSessions
      },
      onlineDoctors,
      activeSessions,
      deviceLocations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Sample Data
router.post('/seed', async (req, res) => {
  try {
    // Create sample doctors
    const doctors = [
      { name: 'Dr. John Smith', email: 'john@telemedicine.com', password: 'password123', specialization: 'General Medicine' },
      { name: 'Dr. Sarah Johnson', email: 'sarah@telemedicine.com', password: 'password123', specialization: 'Cardiology' },
      { name: 'Dr. Mike Wilson', email: 'mike@telemedicine.com', password: 'password123', specialization: 'Pediatrics' }
    ];

    await Doctor.insertMany(doctors);

    // Create sample devices
    const devices = [
      { deviceId: 'DEVICE_001', pharmacyName: 'City Pharmacy', location: { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' } },
      { deviceId: 'DEVICE_002', pharmacyName: 'Health Plus Pharmacy', location: { latitude: 34.0522, longitude: -118.2437, address: 'Los Angeles, CA' } }
    ];

    await Device.insertMany(devices);

    res.json({ message: 'Sample data created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;