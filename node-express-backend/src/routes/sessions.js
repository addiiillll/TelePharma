const express = require('express');
const sessionController = require('../controllers/sessionController');
const deviceAuth = require('../middleware/deviceAuth');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', deviceAuth, sessionController.createSession);

// Allow both device and doctor to update session status
router.put('/:sessionId/status', (req, res, next) => {
  if (req.headers['x-api-key']) {
    return deviceAuth(req, res, next);
  } else {
    return auth(req, res, next);
  }
}, sessionController.updateSessionStatus);

router.get('/doctor', auth, sessionController.getDoctorSessions);
router.get('/all', sessionController.getAllSessions);

module.exports = router;