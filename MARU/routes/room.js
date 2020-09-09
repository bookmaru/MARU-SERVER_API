const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const middleware = require('../modules/middlewares');
const chatController = require('../controllers/chatController');

router.post('/make', middleware.userJwt, roomController.make);
router.get('/limitLeader', middleware.userJwt, roomController.limitLeader);
router.get('/limitJoin', middleware.userJwt, roomController.limitJoin);
router.get('/roomInfo/:roomIdx', roomController.mainRoom);
router.get('/roomQuiz/:roomIdx', roomController.quizRoom);
router.post('/checkQuiz', middleware.userJwt, roomController.checkQuiz);
router.get('/count', roomController.getRoomCount);
router.get('/unread', middleware.userJwt, chatController.getUnread);


module.exports = router