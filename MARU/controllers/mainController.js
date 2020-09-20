const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const mainModel = require('../models/main');
const roomModel = require('../models/room');
const jwt = require('../modules/jwt');

const main = {
  /** 
     * @summary 메인화면 뷰 (모임이 많은 수)
     * @param 
     * @return thumbnail, title, authors, info, nickName
  */
  mainView1: async (req, res) => {
    // 방의 개수가 많은 순서대로
    try {
      const getExpired = await roomModel.getExpired();
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

  /** 
     * @summary 메인화면 뷰 (새로 나온 모임)
     * @param pageStart
     * @param pageEnd
     * @param token (선택)
     * @return thumbnail, title, authors, info, nickName
  */
  // 최근에 만들어진 방은 모임이 많은 방에 들어가면 안됨
  mainView2: async (req, res) => {
    const { pageStart, pageEnd } = req.query;
    const token = req.headers.token;

    if (pageStart === undefined || pageEnd === undefined) {
      res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST, resMessage.NULL_VALUE);
      return;
    }

    // 비로그인 유저
    if (!token) {
      try {
        const getExpired = await roomModel.getExpired();
        // 가장 최근에 개설된 방 순서대로
        const newRoomList = await mainModel.newRoom(pageStart, pageEnd);

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MAIN_VIEW_LIST2, {
          newRoomList: newRoomList
        }));
        return;
      } catch (err) {
        console.log(err);
        res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
        return;
      }
    }


    // 로그인 유저
    const user = await jwt.verify(token);

    if (user === -3) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
    }

    if (user === -2) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }

    if (user.userIdx === undefined) {
      return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }

    try {
      const getExpired = await roomModel.getExpired();
      // 가장 최근에 개설된 방 순서대로
      const newRoomList = await mainModel.newRoom(user.userIdx, pageStart, pageEnd);

      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_MAIN_VIEW_LIST2, {
        newRoomList: newRoomList
      }));
      return;
    } catch (err) {
      console.log(err);
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
      return;
    }

  }
}

module.exports = main;

