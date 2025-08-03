const Session = require('../models/Session');
const Doctor = require('../models/Doctor');
const { v4: uuidv4 } = require('uuid');
const notificationService = require('../services/notificationService');

const sessionController = {
  // Create new session (device-initiated)
  createSession: async (req, res) => {
    try {
      const deviceId = req.device.deviceId;
      
      // Find doctors who are available and online
      const availableDoctors = await Doctor.find({ 
        isAvailable: true, 
        isOnline: true 
      });
      
      if (availableDoctors.length === 0) {
        return res.status(404).json({ error: 'No doctors available' });
      }
      
      // Find a doctor who is not in any active/waiting session
      let availableDoctor = null;
      for (const doctor of availableDoctors) {
        const existingSession = await Session.findOne({
          doctorId: doctor._id,
          status: { $in: ['active', 'waiting'] }
        });
        
        if (!existingSession) {
          availableDoctor = doctor;
          break;
        }
      }
      
      if (!availableDoctor) {
        return res.status(409).json({ error: 'All doctors are currently busy' });
      }
      
      const sessionId = uuidv4();
      const firebaseRoomId = `session_${sessionId}`;
      
      const session = new Session({
        sessionId,
        deviceId,
        doctorId: availableDoctor._id,
        firebaseRoomId,
        status: 'waiting' // Start as waiting for doctor acceptance
      });
      
      await session.save();
      
      // Send notification to doctor
      await notificationService.sendNotification(
        'doctor',
        availableDoctor._id.toString(),
        'session_request',
        'New Session Request',
        `Patient waiting for consultation at ${req.device.pharmacyName}`,
        session.sessionId
      );
      
      res.status(201).json({ 
        sessionId: session.sessionId,
        firebaseRoomId,
        doctorName: availableDoctor.name,
        status: 'waiting'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update session status
  updateSessionStatus: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { status } = req.body;
      
      const session = await Session.findOne({ sessionId });
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      session.status = status;
      
      // Handle notifications based on status
      if (status === 'active' && req.doctor) {
        // Doctor accepted - notify device
        await notificationService.sendNotification(
          'device',
          session.deviceId,
          'session_accepted',
          'Doctor Connected',
          `Dr. ${req.doctor.name} has joined your consultation`,
          session.sessionId
        );
      } else if (status === 'completed') {
        // Session completed - notify device
        await notificationService.sendNotification(
          'device',
          session.deviceId,
          'session_completed',
          'Session Completed',
          'Your consultation has been completed. Thank you!',
          session.sessionId
        );
      }
      
      if (status === 'completed' || status === 'cancelled') {
        session.endTime = new Date();
        
        // Make doctor available again
        const doctor = await Doctor.findById(session.doctorId);
        if (doctor) {
          doctor.isAvailable = true;
          await doctor.save();
        }
      }
      
      await session.save();
      res.json({ session });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get doctor's own sessions + waiting sessions
  getDoctorSessions: async (req, res) => {
    try {
      const sessions = await Session.find({
        $or: [
          { doctorId: req.doctor._id }, // Doctor's own sessions
          { status: 'waiting', doctorId: { $exists: true } } // Waiting sessions for any doctor
        ]
      })
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 });
      
      res.json({ sessions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all sessions (for admin only)
  getAllSessions: async (req, res) => {
    try {
      const sessions = await Session.find()
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 });
      
      res.json({ sessions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = sessionController;