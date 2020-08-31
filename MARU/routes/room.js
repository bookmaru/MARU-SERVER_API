const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const middleware = require('../modules/middlewares');

router.post('/make', middleware.userJwt, roomController.make);
router.get('/limitLeader', middleware.userJwt, roomController.limitLeader);
router.get('/limitJoin', middleware.userJwt, roomController.limitJoin);
router.get('/roomInfo/:roomIdx', roomController.mainRoom);
router.get('/roomQuiz/:roomIdx',middleware.userJwt, roomController.quizRoom);
router.post('/CheckQuiz', middleware.userJwt, roomController.checkQuiz);


module.exports = router