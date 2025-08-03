const Device = require('../models/Device');

const deviceController = {
  // Register Pharmacy Device
  register: async (req, res) => {
    try {
      const { deviceId, pharmacyName, latitude, longitude, address } = req.body;
      
      const device = new Device({
        deviceId,
        pharmacyName,
        location: { latitude, longitude, address }
      });
      
      await device.save();
      res.status(201).json({ message: 'Device registered successfully', device });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Device ID already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Get All Devices
  getAll: async (req, res) => {
    try {
      const devices = await Device.find({ isActive: true });
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update Device Ping
  updatePing: async (req, res) => {
    try {
      const device = await Device.findOneAndUpdate(
        { deviceId: req.params.deviceId },
        { lastPing: new Date() },
        { new: true }
      );
      
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      res.json({ message: 'Ping updated', lastPing: device.lastPing });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = deviceController;