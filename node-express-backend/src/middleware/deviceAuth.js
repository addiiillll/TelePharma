const Device = require('../models/Device');

const deviceAuth = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-Key');
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const device = await Device.findOne({ apiKey, isActive: true });
    if (!device) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    device.lastPing = new Date();
    await device.save();
    
    req.device = device;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Device authentication failed' });
  }
};

module.exports = deviceAuth;