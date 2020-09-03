const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:roomIdx', chatController.getChat);

module.exports = router;