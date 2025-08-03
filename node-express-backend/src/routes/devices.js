const express = require('express');
const deviceController = require('../controllers/deviceController');
const router = express.Router();

router.post('/register', deviceController.register);
router.get('/', deviceController.getAll);
router.get('/pharmacy', deviceController.getByPharmacy);
router.patch('/:deviceId/ping', deviceController.updatePing);

module.exports = router;