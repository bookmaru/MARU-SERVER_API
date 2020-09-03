const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const chatModel = require('../models/chat');
const chat = {
  getChat: async (req, res) => {
    const roomIdx = req.params.roomIdx;
    const getChat = await chatModel.getChat(roomIdx);
    if (getChat) {
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSSIBLE_JOIN_ROOM, getChat));
      return;
    }
  }
}

module.exports = chat;