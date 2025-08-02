const express = require('express');
const Session = require('../models/Session');
const Doctor = require('../models/Doctor');
const Device = require('../models/Device');
const router = express.Router();

// Initiate Session from Pharmacy Device
router.post('/initiate', async (req, res) => {
  try {
    const { deviceId, patientName, patientAge, symptoms } = req.body;
    
    // Verify device exists
    const device = await Device.findOne({ deviceId, isActive: true });
    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    // Find available doctor
    const availableDoctor = await Doctor.findOne({ 
      isOnline: true, 
      isAvailable: true 
    });

    const sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = new Session({
      sessionId,
      deviceId,
      doctorId: availableDoctor?._id,
      patientName,
      patientAge,
      symptoms,
      status: availableDoctor ? 'active' : 'waiting'
    });

    await session.save();
    await session.populate('doctorId', 'name specialization');

    res.status(201).json({ 
      message: 'Session initiated', 
      session,
      doctor: availableDoctor ? {
        name: availableDoctor.name,
        specialization: availableDoctor.specialization
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Session Status
router.patch('/:sessionId/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = { status };
    
    if (status === 'completed') {
      updateData.endTime = new Date();
    }
    if (notes) {
      updateData.notes = notes;
    }

    const session = await Session.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      updateData,
      { new: true }
    ).populate('doctorId', 'name specialization');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;