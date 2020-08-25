const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const middleware = require('../modules/middlewares');

router.post('/make', middleware.userJwt, roomController.make);
router.get('/limitLeader', middleware.userJwt, roomController.limitLeader);
router.get('/limitJoin', middleware.userJwt, roomController.limitJoin);


module.exports = router