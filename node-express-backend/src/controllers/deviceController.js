const Device = require('../models/Device');

const deviceController = {
  // Register Pharmacy Device
  register: async (req, res) => {
    try {
      const { pharmacyName, location } = req.body;
      
      // Auto-generate MAC address-like device ID
      const generateDeviceId = () => {
        const chars = '0123456789ABCDEF';
        const segments = [];
        for (let i = 0; i < 6; i++) {
          let segment = '';
          for (let j = 0; j < 2; j++) {
            segment += chars[Math.floor(Math.random() * chars.length)];
          }
          segments.push(segment);
        }
        return `PH:${segments.join(':')}`;
      };
      
      let deviceId;
      let isUnique = false;
      while (!isUnique) {
        deviceId = generateDeviceId();
        const existingDevice = await Device.findOne({ deviceId });
        if (!existingDevice) {
          isUnique = true;
        }
      }
      
      const device = new Device({
        deviceId,
        pharmacyName,
        location,
        apiKey: require('crypto').randomBytes(32).toString('hex')
      });
      
      await device.save();
      res.status(201).json({ message: 'Device registered successfully', device });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get All Devices (for admin)
  getAll: async (req, res) => {
    try {
      const devices = await Device.find({ isActive: true });
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get devices by pharmacy name (for pharmacy portal)
  getByPharmacy: async (req, res) => {
    try {
      const { pharmacyName } = req.query;
      if (!pharmacyName) {
        return res.status(400).json({ error: 'Pharmacy name is required' });
      }
      
      const devices = await Device.find({ 
        pharmacyName: { $regex: new RegExp(pharmacyName, 'i') },
        isActive: true 
      });
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