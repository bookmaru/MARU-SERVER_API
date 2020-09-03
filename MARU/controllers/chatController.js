const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const chatModel = require('../models/chat');
const moment = require('moment');
const chat = {
  sendChat: async (req, res) => {
    const userIdx = req.userIdx;

    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    const { msg,  roomIdx } = req.body;
    let chatTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
    //chatTime은 moment 모듈

    if (!msg || !roomIdx || !chatTime ) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    try {
      const sendMsg = await chatModel.sendChat(userIdx, msg, chatTime, roomIdx);
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
      return;
    }

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEND_CHAT_SUCCESS, {
      sendMsg:sendMsg
    }));
  },

}

module.exports = chat;