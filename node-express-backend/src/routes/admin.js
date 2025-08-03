const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.post('/login', adminController.login);
router.post('/create', adminController.createAdmin);
router.get('/dashboard', adminController.getDashboard);
router.get('/doctors', adminController.getDoctors);
router.post('/seed', adminController.seedData);

module.exports = router;