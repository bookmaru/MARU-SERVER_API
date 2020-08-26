const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const middleware = require('../modules/middlewares');

router.get('/roomInfo/:roomIdx', roomController.mainRoom);
router.get('/roomQuiz/:roomIdx',middleware.userJwt, roomController.quizRoom);

module.exports = router;