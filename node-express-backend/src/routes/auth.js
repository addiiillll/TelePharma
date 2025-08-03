const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', auth, authController.verifyToken);
router.get('/profile', auth, authController.verifyToken);
router.post('/logout', auth, authController.logout);
router.post('/toggle-availability', auth, authController.toggleAvailability);

module.exports = router;