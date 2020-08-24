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
    const mainViewList = await mainModel.view();
    const newRoomList = await mainModel.newRoom();

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MAIN_VIEW_LIST, {
      maxRoomList: mainViewList,
      newRoomList: newRoomList
    }));
  }

}

module.exports = main;

