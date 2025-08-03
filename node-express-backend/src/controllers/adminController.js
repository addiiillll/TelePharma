const Doctor = require('../models/Doctor');
const Device = require('../models/Device');
const Session = require('../models/Session');

const adminController = {
  // Get dashboard stats
  getDashboardStats: async (req, res) => {
    try {
      // Doctor stats
      const totalDoctors = await Doctor.countDocuments();
      const onlineDoctors = await Doctor.countDocuments({ isOnline: true });
      const availableDoctors = await Doctor.countDocuments({ isAvailable: true, isOnline: true });

      // Device stats
      const totalDevices = await Device.countDocuments();
      const activeDevices = await Device.countDocuments({ isActive: true });

      // Session stats
      const totalSessions = await Session.countDocuments();
      const activeSessions = await Session.countDocuments({ status: 'active' });
      const waitingSessions = await Session.countDocuments({ status: 'waiting' });
      const completedSessions = await Session.countDocuments({ status: 'completed' });

      // Today's sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = await Session.countDocuments({
        createdAt: { $gte: today }
      });

      res.json({
        doctors: {
          total: totalDoctors,
          online: onlineDoctors,
          available: availableDoctors
        },
        devices: {
          total: totalDevices,
          active: activeDevices
        },
        sessions: {
          total: totalSessions,
          active: activeSessions,
          waiting: waitingSessions,
          completed: completedSessions,
          today: todaySessions
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get online doctors
  getOnlineDoctors: async (req, res) => {
    try {
      const doctors = await Doctor.find({ isOnline: true })
        .select('name email specialization isAvailable lastActive')
        .sort({ lastActive: -1 });
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get active sessions with details
  getActiveSessions: async (req, res) => {
    try {
      const sessions = await Session.find({ status: { $in: ['active', 'waiting'] } })
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 });
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get device locations for map
  getDeviceLocations: async (req, res) => {
    try {
      const devices = await Device.find({ isActive: true })
        .select('deviceId pharmacyName location lastPing');
      
      // Transform the data to include coordinates array
      const transformedDevices = devices.map(device => ({
        ...device.toObject(),
        location: {
          ...device.location,
          coordinates: [device.location.longitude, device.location.latitude]
        }
      }));
      
      res.json(transformedDevices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all doctors with pagination and search
  getDoctors: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
      const skip = (page - 1) * limit;

      // Build search query
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } }
        ];
      }

      // Add status filter
      if (status === 'online') {
        query.isOnline = true;
      } else if (status === 'offline') {
        query.isOnline = false;
      } else if (status === 'available') {
        query.isAvailable = true;
        query.isOnline = true;
      }

      const doctors = await Doctor.find(query)
        .select('name email specialization isOnline isAvailable createdAt lastActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Doctor.countDocuments(query);

      res.json({
        doctors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all sessions with pagination and search
  getSessions: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
      const skip = (page - 1) * limit;

      let query = {};
      if (status !== 'all') {
        query.status = status;
      }

      const sessions = await Session.find(query)
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Session.countDocuments(query);

      res.json({
        sessions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all pharmacies with pagination and search
  getPharmacies: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
      const skip = (page - 1) * limit;

      let query = {};
      if (search) {
        query.$or = [
          { pharmacyName: { $regex: search, $options: 'i' } },
          { deviceId: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } }
        ];
      }

      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }

      const devices = await Device.find(query)
        .select('deviceId pharmacyName location isActive lastPing createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Transform the data to match frontend expectations
      const transformedDevices = devices.map(device => ({
        ...device.toObject(),
        location: {
          ...device.location,
          coordinates: [device.location.longitude, device.location.latitude]
        }
      }));

      const total = await Device.countDocuments(query);

      res.json({
        pharmacies: transformedDevices,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = adminController;