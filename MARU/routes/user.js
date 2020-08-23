const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../modules/middlewares');

router.post('/signup', userController.signup); //회원가입
router.post('/signin', userController.signin); //로그인
router.post('/checkId', userController.checkUserId); //아아디 중복체크
router.post('/checkNick', userController.checkUserNickName); //닉네임 중복체크
router.post('/rating', userController.rating); //방장 별점 평가
router.get('/profile', middleware.userJwt, userController.profile); //내 프로필 조회
router.post('/withdrawal', middleware.userJwt, userController.withdrawal); //회원탈퇴
module.exports = router;
