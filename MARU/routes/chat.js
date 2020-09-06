const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const middleware = require('../modules/middlewares');
router.get('/', function(req,res){
    res.render('index');
});
router.get('/:roomIdx', chatController.getChat);
router.get('/unread/:roomIdx', middleware.userJwt, chatController.getUnread);
module.exports = router;