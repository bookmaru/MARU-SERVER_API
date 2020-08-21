const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const middleware = require('../modules/middlewares');

router.post('/make', middleware.userJwt, roomController.make);


module.exports = router;