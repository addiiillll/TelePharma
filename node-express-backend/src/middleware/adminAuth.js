const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      console.log('No adminToken cookie found');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log('Auth error:', error.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = adminAuth;