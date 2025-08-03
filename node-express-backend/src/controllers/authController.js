const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const authController = {
  // Doctor Registration
  register: async (req, res) => {
    try {
      const { name, email, password, specialization } = req.body;
      
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const doctor = new Doctor({ name, email, password, specialization });
      await doctor.save();

      res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Doctor Login
  login: async (req, res) => {
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
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ 
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
  },

  // Doctor Logout
  logout: async (req, res) => {
    try {
      req.doctor.isOnline = false;
      req.doctor.isAvailable = false;
      await req.doctor.save();
      
      res.clearCookie('token');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Verify Token
  verifyToken: async (req, res) => {
    try {
      res.json({ 
        doctor: { 
          id: req.doctor._id, 
          name: req.doctor.name, 
          email: req.doctor.email,
          specialization: req.doctor.specialization,
          isAvailable: req.doctor.isAvailable 
        } 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Toggle Availability
  toggleAvailability: async (req, res) => {
    try {
      req.doctor.isAvailable = !req.doctor.isAvailable;
      await req.doctor.save();
      res.json({ isAvailable: req.doctor.isAvailable });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;