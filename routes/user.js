const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/checkId', userController.checkUserId);
router.post('/checkNick', userController.checkUserNickName);
module.exports = router;
