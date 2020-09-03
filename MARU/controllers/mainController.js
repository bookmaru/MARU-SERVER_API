const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const mainModel = require('../models/main');

const main = {

  /** 
     * @summary 메인화면 뷰
     * @param 
     * @return thumbnail, title, authors, info, nickName
     */
  mainView1: async (req, res) => {
    // 방의 개수가 많은 순서대로
    try {
      const popularViewList = await mainModel.ManyRoom();
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MAIN_VIEW_LIST1, {
        popularRoomList: popularViewList,
      }));
      return;
    } catch (err) {
      console.log(err);
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
    }
  },

  // 최근에 만들어진 방은 모임이 많은 방에 들어가면 안됨
  mainView2: async(req, res) => {
    const {pageStart, pageEnd} = req.query;

    if (pageStart === undefined || pageEnd === undefined) {
      res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST, resMessage.NULL_VALUE);
      return;
    }

    try {
      // 가장 최근에 개설된 방 순서대로
      const newRoomList = await mainModel.newRoom(pageStart - 1, pageEnd);

      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MAIN_VIEW_LIST2, {
        newRoomList: newRoomList
      }));
      return;
    } catch (err) {
      console.log(err);
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
    }
  }

}

module.exports = main;

