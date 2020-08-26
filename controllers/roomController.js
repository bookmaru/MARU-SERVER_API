const roomModel = require('../models/room');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

module.exports = {
    mainRoom: async(req, res)=>{
        const roomIdx = req.params.roomIdx;
        if( !roomIdx ){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const idx = await roomModel.mainRoom(roomIdx);
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_ROOM_SUCCESS, idx));
    }, 
    quizRoom: async(req, res) =>{
        const roomIdx = req.params.roomIdx;
        if( !roomIdx ) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const userIdx = req.userIdx;
        if( !userIdx ) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
            return;
        }
        const result = await roomModel.quizRoom(userIdx,roomIdx);
        if( result.length === 0 ) {
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_ROOM));
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_QUIZ_SUCCESS, result));
    }
}