const userModel = require('../models/user');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/crypto');
const jwt = require('../modules/jwt')

module.exports = {
  signup : async ( req, res ) => {
    const {
      id,
      password,
      nickName,
      rating,
      count,
      deviceToken,
    } = req.body;

    if (!id || !password || !nickName || !deviceToken) {
      res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }
    // 사용자 중인 아이디가 있는지 확인
    if (await userModel.checkUser(id)) {
      res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
      return;
    }

    if (await userModel.checkUserNick(nickName)) {
      res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_NICKNAME));
      return;
    }

    const {
      salt,
      hashed
    } = await encrypt.encrypt(password);

    const idx = await userModel.signup( id, hashed, salt, nickName, rating, count, deviceToken);
    if ( idx === -1 ) {
      return res.status(statusCode.DB_ERROR)
        .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }

    const user = await userModel.getUserById(idx);

    if (user[0] === undefined) {
      return res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }

    const {
      token,
      refreshToken
    } = await jwt.sign(user[0]);

    res.status(statusCode.OK)
      .send(util.success(statusCode.OK, resMessage.CREATED_USER, {
        accessToken: token,
        refreshToken: refreshToken
      }));     
  },

  signin : async (req, res) => {
    const {
      id,
      password
    } = req.body;

    if (!id || !password) {
      res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    // User의 아이디가 있는지 확인 - 없다면 NO_USER 반납
    const user = await userModel.findByUserId(id); 

    if (user[0] === undefined) {
      return res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }
    // req의 Password 확인 - 틀렸다면 MISS_MATCH_PW 반납
    const hashed = await encrypt.encryptWithSalt(password, user[0].salt);

    if (hashed !== user[0].password) {
      return res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
    }

    // 로그인할 때 refreshToken, accessToken 새로 발급
    const {
      token,
      refreshToken
    } = await jwt.sign(user[0]);

    // 로그인이 성공적으로 마쳤다면 - LOGIN_SUCCESS 전달
    res.status(statusCode.OK)
      .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
        accessToken: token,
        refreshToken: refreshToken
    }));
  },

  withdrawal : async (req, res) => {
    const { password} = req.body;
    const userIdx = req.userIdx;

    if (!userIdx || !password) {
      res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }
    // User의 아이디가 있는지 확인 - 없다면 NO_USER 반납
    const user = await userModel.getUserByIdx(userIdx);

    if (user[0] === undefined) {
      return res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }

    // req의 Password 확인 - 틀렸다면 MISS_MATCH_PW 반납
    const hashed = await encrypt.encryptWithSalt(password, user[0].salt);

    if (hashed !== user[0].password) {
      return res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
    }

    const idx = await userModel.withdrawal(userIdx);

    // 로그인이 성공적으로 마쳤다면 - LOGIN_SUCCESS 전달
    res.status(statusCode.OK)
      .send(util.success(statusCode.OK, resMessage.WITHDRAWAL_SUCCESS));
  },

  profile : async(req, res) => {
    const userIdx = req.userIdx;
    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN))
      return;
    }
    const idx = await userModel.profile(userIdx);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_PROFILE_READ, 
      idx
    ))
  },

  checkUserId : async(req, res) => {
    const {id} = req.body;

    if (!id) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE))
      return;
    }

    // 사용자 중인 아이디가 있는지 확인
    if (await userModel.checkUser(id)) {
      res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
      return;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.AVAILABLE_ID))
  },

  checkUserNickName : async(req, res) => {
    const {nickName} = req.body;

    if (!nickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE))
      return;
    }

    // 사용자 중인 아이디가 있는지 확인
    if (await userModel.checkUserNick(nickName)) {
      res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_NICKNAME));
      return;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.AVAILABLE_NICKNAME))
  },

  rating : async ( req, res ) => {
    const {nickName} = req.body;
    let {rating} = req.body;
    if (!rating){
      rating = 3;
    }
    if (!nickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE))
      return;
  }

    const idx = await userModel.rating(nickName, rating);
    console.log({rating});
    if ( idx === -1 ) {
      return res.status(statusCode.DB_ERROR)
        .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }

    res.status(statusCode.OK)
      .send(util.success(statusCode.OK, resMessage.UPDATE_RATING));
  },

/*
* 나의 모임
* param token
* return thumbnail, title, authors, info (최근 채팅 수)
*/

  myRoom: async (req, res) => {
    const userIdx = req.userIdx;

    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    const myRoomList = await userModel.myRoomList(userIdx);

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MY_ROOM_LIST, myRoomList));
  },

  report: async (req, res) => {
    const reporterIdx = req.userIdx;
    
    if (!reporterIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    const {
      reportMsg,
      reportNickName
    } = req.body;

    if (!reportMsg || !reportNickName) {
      res.status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
    }

    const report = await userModel.report(reporterIdx, reportMsg, reportNickName);
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.REPORT_SUCCESS, report));

  },

  updateToken: async (req, res) => {
    const userIdx = req.userIdx;

    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    const {deviceToken} = req.body;

    if(!deviceToken){
      res.status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
    }
    const result = await userModel.updateToken(userIdx, deviceToken);
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.UPDATE_TOKEN_SUCCESS, {
      deviceToken: deviceToken
    }));
  }
}