const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.patch('/availability', auth, authController.toggleAvailability);

module.exports = router;