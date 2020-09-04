const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const chatModel = require('../models/chat');

const chat = {
  getChat: async (req, res) => {
    const roomIdx = req.params.roomIdx;
    
    if (!roomIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    try {
      const getChat = await chatModel.getChat(roomIdx);
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSSIBLE_JOIN_ROOM, getChat));
      return;
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
    }
  
  }
}

module.exports = chat;