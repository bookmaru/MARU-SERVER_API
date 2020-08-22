const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../modules/middlewares');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/checkId', userController.checkUserId);
router.post('/checkNick', userController.checkUserNickName);
router.post('/rating', middleware.userJwt, userController.rating);
router.get('/profile', middleware.userJwt, userController.profile);
module.exports = router;
