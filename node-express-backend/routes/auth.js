const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const router = express.Router();

// Doctor Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    
    if (!doctor || !(await doctor.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    doctor.isOnline = true;
    doctor.lastActive = new Date();
    await doctor.save();

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      doctor: { 
        id: doctor._id, 
        name: doctor.name, 
        email: doctor.email,
        specialization: doctor.specialization,
        isAvailable: doctor.isAvailable 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor Logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.doctor.isOnline = false;
    req.doctor.isAvailable = false;
    await req.doctor.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Availability
router.patch('/availability', auth, async (req, res) => {
  try {
    req.doctor.isAvailable = !req.doctor.isAvailable;
    await req.doctor.save();
    res.json({ isAvailable: req.doctor.isAvailable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;