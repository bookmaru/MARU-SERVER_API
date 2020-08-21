const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const roomModel = require('../models/room');

const room = {
  /** 
     * @summary 토론방 만들기
     * @param token, thumbnail, authors, title, quiz (1 ~ 5), answer (1 ~ 5), createdAt 
     * @return 
     */
    make: async(req, res) => {
      const userIdx = req.userIdx;

      if (!userIdx) {
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
        return;
      }

      const {thumbnail, authors, title, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt} = req.body;

      if (!thumbnail || !authors || !title || !quiz1 || !quiz2 || !quiz3 || !quiz4 || !quiz5 || !answer1 || !answer2 || !answer3 || !answer4 || !answer5 || !createdAt) {
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
      }

      const roomMake = await roomModel.make(thumbnail, authors, title, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx);

      if (!roomMake) {
        res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        return;
      }

      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MAKE_ROOM_SUCCESS));
      
    }
}

module.exports = room;