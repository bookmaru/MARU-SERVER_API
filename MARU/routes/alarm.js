const express = require('express');
const router = express.Router();
const alarmController = require('../controllers/alarmController');

router.post('/:roomIdx', alarmController.alarm);

module.exports = router;