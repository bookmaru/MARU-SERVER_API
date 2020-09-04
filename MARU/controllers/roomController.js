const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const roomModel = require('../models/room');
const { catch } = require('../config/database');

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

    const { thumbnail, authors, title, info, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt } = req.body;

    if (!thumbnail || !authors || !title || !info || !quiz1 || !quiz2 || !quiz3 || !quiz4 || !quiz5 || !answer1 || !answer2 || !answer3 || !answer4 || !answer5 || !createdAt) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    try {
      const roomMake = await roomModel.make(thumbnail, authors, title, info, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx);
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
      return;
    }

    const roomIdx = await roomModel.getRoomIdx(userIdx);

    const addLeader = await roomModel.addUser(userIdx, roomIdx);

    if (addLeader === -1) {
      return res.status(statusCode.DB_ERROR)
        .send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MAKE_ROOM_SUCCESS, {
      roomIdx: roomIdx
    }));
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
      const CheckLimitMakeRoom = await roomModel.limitMakeRoom(userIdx);
      // 방을 만들 수 있을 때
      if (CheckLimitMakeRoom) {
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSSIBLE_MAKE_ROOM));
        return;
      }
      // 방장 제한 
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NOT_POSSIBLE_MAKE_ROOM));
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

    const limitParticipant = await roomModel.limitJoin(userIdx);

    // 토론방 참여 가능
    if (limitParticipant) {
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSSIBLE_JOIN_ROOM));
      return;
    }

    // 토론방 참여 불가능
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NOT_POSSIBLE_JOIN_ROOM));
  },

  mainRoom: async (req, res) => {
    const roomIdx = req.params.roomIdx;
    
    if (!roomIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }
    
    try {
      const idx = await roomModel.mainRoom(roomIdx);
      return res.status(statusCode.OK)
      .send(util.success(statusCode.OK, resMessage.READ_ROOM_SUCCESS, idx));
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
    }

  },

  quizRoom: async (req, res) => {
    const roomIdx = req.params.roomIdx;
    if (!roomIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }
    const userIdx = req.userIdx;
    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }
    const result = await roomModel.quizRoom(userIdx, roomIdx);
    if (result.length === 0) {
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_ROOM));
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
      } catch (err) {
        res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        return;
      }

      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_QUIZ_SOLVED));
      return;
    }

      
    },
  mainRoom: async (req, res) => { 
    const roomIdx = req.params.roomIdx;
    
    if (!roomIdx) {
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
    }
    
    const idx = await roomModel.mainRoom(roomIdx);
    return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.READ_ROOM_SUCCESS, idx));
  }, 
  
  quizRoom: async (req, res) => {
     const roomIdx = req.params.roomIdx;
    
     if (!roomIdx) {
         res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
         return;
     }
     const userIdx = req.userIdx;
    
     if (!userIdx) {
         res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
         return;
     }
     const result = await roomModel.quizRoom(userIdx,roomIdx);
     if (result.length === 0) {
         res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_ROOM));
     }

    // false 라면 failQuize 테이블 insert
    try {
      const failQuiz = await roomModel.quizFail(userIdx, roomIdx);
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
      return;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.FAIL_QUIZ_SOLVED));
  }
}

module.exports = room;