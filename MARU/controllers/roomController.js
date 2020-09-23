const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const roomModel = require('../models/room');
const moment = require('moment');
const Hangul = require('hangul-js');
require('moment-timezone');

const room = {

  /** 
     * @summary 토론방 만들기
     * @param token, thumbnail, authors, title, quiz (1 ~ 5), answer (1 ~ 5), createdAt 
     * @return 
  */

  make: async (req, res) => {
    const userIdx = req.userIdx;

    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    const { thumbnail, authors, title, info, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, expired} = req.body;

    if (!thumbnail || !authors || !title || !info || !quiz1 || !quiz2 || !quiz3 || !quiz4 || !quiz5 || !answer1 || !answer2 || !answer3 || !answer4 || !answer5) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

  
    try {    
      // 모든 공백을 제거하는 정규식
      const searchKeyword = title.replace(/(\s*)/g,"");
      const consonantVowel = Hangul.disassemble(searchKeyword);
      moment.tz.setDefault("Asia/Seoul");
      const createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

      // 자모음 분리 결과가 배열이라 문자열로 합치기 
      const titleConsonatVowel = consonantVowel.join("");

      const roomMake = await roomModel.make(thumbnail, authors, title, titleConsonatVowel, info, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx);
      const participantAdd = await roomModel.addUser(userIdx, roomMake);
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MAKE_ROOM_SUCCESS, {
        roomIdx: roomMake
      }));
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.INTERNAL_SERVER_ERROR));
      return;
    }

  },

  /** 
    * @summary 토론방 제한
    * @param token
    * @return 
  */

  limitLeader: async (req, res) => {
    const userIdx = req.userIdx;

    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    try {
      const getExpired = await roomModel.getExpired();
      const CheckLimitMakeRoom = await roomModel.limitMakeRoom(userIdx);
      // 방을 만들 수 있을 때
      if (CheckLimitMakeRoom) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSSIBLE_MAKE_ROOM));
        return;
      }
      // 방장 제한 
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NOT_POSSIBLE_MAKE_ROOM));
      return;
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
      return;
    }
  },

  /** 
    * @summary 토론방 참여 제한
    * @param token, roomIdx
    * @return 
  */

  limitJoin: async (req, res) => {
    const userIdx = req.userIdx;

    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    try {
      const getExpired = await roomModel.getExpired();
      const limitParticipant = await roomModel.limitJoin(userIdx);
      // 토론방 참여 가능
      if (limitParticipant) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSSIBLE_JOIN_ROOM));
        return;
      }
      // 토론방 참여 불가능
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NOT_POSSIBLE_JOIN_ROOM));
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
      return;
    }
  },

  /** 
    * @summary 토론방 소개
    * @param roomIdx
    * @return 
  */

  mainRoom: async (req, res) => {
    const roomIdx = req.params.roomIdx;

    if (!roomIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    try {
      const idx = await roomModel.mainRoom(roomIdx);
      return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ROOM_SUCCESS, idx));

    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
    }

  },


  /** 
    * @summary 토론방 퀴즈 합격 여부
    * @param token, flag, roomIdx
    * @return 
  */

  checkQuiz: async (req, res) => {
    const userIdx = req.userIdx;

    // 토큰이 없을 때
    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    // 해당 roomIdx, 퀴즈 합격여부 (true, false)
    const { roomIdx, isCheck } = req.body;

    if (!roomIdx || isCheck === undefined) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    if (isCheck) {
      // true 라면 participant 테이블 insert
      try {
        const participant = await roomModel.quizPass(userIdx, roomIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_QUIZ_SOLVED));
        return;
      } catch (err) {
        res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        return;
      }
    }

    try {
      const quizFail = await roomModel.quizFail(userIdx, roomIdx);
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.FAIL_QUIZ_SOLVED));
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
      return;
    }

  },


  /** 
    * @summary 토론방 퀴즈 
    * @param roomIdx
    * @return 
  */

  quizRoom: async (req, res) => {
    const roomIdx = req.params.roomIdx;

    if (!roomIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    try {
      const result = await roomModel.quizRoom(roomIdx);
      if (result.length === 0) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_ROOM));
        return;
      }
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_ROOM_SUCCESS, result));
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
      return;
    }
  },


  /** 
    * @summary 채팅방 개수 가져오기
    * @param 
    * @return getRoomCount 
  */

  getRoomCount: async (req, res) => {
    try {
      const getRoomCount = await roomModel.getRoomCount();
      if (getRoomCount) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_GET_ROOM_COUNT, { getRoomCount }));
        return;
      }
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
      return;
    }
  },
  getExpired: async (req, res) => {
    try {
      const getExpired = await roomModel.getExpired();
      if (getExpired) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_GET_ROOM_COUNT, {getExpired}));
        return;
      } 
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
      return;
    }
  },

}

module.exports = room;