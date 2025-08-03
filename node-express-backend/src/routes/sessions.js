const express = require('express');
const sessionController = require('../controllers/sessionController');
const router = express.Router();

router.post('/initiate', sessionController.initiate);
router.get('/', sessionController.getAll);
router.patch('/:sessionId/status', sessionController.updateStatus);

module.exports = router;