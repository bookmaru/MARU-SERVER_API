const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
router.get('/', function(req,res){
    res.render('index');
});
router.get('/:roomIdx', chatController.getChat);
module.exports = router;