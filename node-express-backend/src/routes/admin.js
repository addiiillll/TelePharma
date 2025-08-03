const express = require('express');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const Admin = require('../models/Admin');
const router = express.Router();

// Admin login route (public)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const token = require('jsonwebtoken').sign(
      { role: 'admin', id: admin._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({ message: 'Admin login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin logout route (public)
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Admin logout successful' });
});

// Protected admin routes
router.use(adminAuth);

router.get('/profile', (req, res) => {
  res.json({ email: req.admin.email, name: 'Admin' });
});
router.get('/stats', adminController.getDashboardStats);
router.get('/doctors/online', adminController.getOnlineDoctors);
router.get('/doctors', adminController.getDoctors);
router.get('/sessions/active', adminController.getActiveSessions);
router.get('/sessions', adminController.getSessions);
router.get('/devices/locations', adminController.getDeviceLocations);
router.get('/pharmacies', adminController.getPharmacies);

module.exports = router;