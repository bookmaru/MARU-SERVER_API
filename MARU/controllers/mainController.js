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
  mainView: async (req, res) => {
    // 방의 개수가 많은 순서대로
    const mainViewList = await mainModel.view();

    // 가장 최근에 개설된 방 순서대로
    const newRoomList = await mainModel.newRoom();

  
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MAIN_VIEW_LIST, {
      maxRoomList: mainViewList,
      newRoomList: newRoomList
    }));
  }

}

module.exports = main;

