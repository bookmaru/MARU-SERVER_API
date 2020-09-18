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
    const {pageStart, pageEnd} = req.query;

    if (pageStart === undefined || pageEnd === undefined) {
      res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST, resMessage.NULL_VALUE);
      return;
    }

    console.log(pageStart + " " + pageEnd);
    try {
      const getChat = await chatModel.getChat(roomIdx, pageStart -1 , pageEnd);
      getChat.reverse();
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MESSAGE_GET, getChat));

      return;
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
    }
  
  },

  getUnread: async (req, res) => {
    // const roomIdx = req.params.roomIdx;
    let {roomIdx1, roomIdx2, roomIdx3} = req.body;
    const userIdx = req.userIdx;
    if (!roomIdx1){
      roomIdx1=0;
    }
    if (!roomIdx2){
      roomIdx2=0;
    }
    if (!roomIdx3){
      roomIdx3=0;
    }
    // if (!roomIdx) {
    //   res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    //   return;
    // }

    if (!userIdx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
      return;
    }

    try {
      const getUnread = await chatModel.getUnread(roomIdx1, roomIdx2, roomIdx3, userIdx);
      const getAlready = await chatModel.getAlready(roomIdx1, roomIdx2, roomIdx3);
      const getCount = await chatModel.getCount(roomIdx1, roomIdx2, roomIdx3, userIdx);
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_GET_UNREAD, {getCount:getCount, getAlready: getAlready, getUnread: getUnread}));
      return;
    } catch (err) {
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
    }
  
  }
}

module.exports = chat;