const firebase = require('../modules/alarm');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const alarmModel = require('../models/alarm');

module.exports = {
    send: async (req, res) => {
        const { registerToken } = req.body;
        if(!registerToken) {
            const missValue = Object.entries({registerToken})
            .filter(it => it[1] == undefined).map(it => it[0]).join(',');
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(missValue +'에 해당하는 '+resMessage.NULL_VALUE));
            return;
        }
        try {
            firebase.message(registerToken);
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEND_MESSAGE_SUCCESS));
        } catch (err) {
            console.log('[alarmController.js] ', err);
            res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(resMessage.INTERNAL_SERVER_ERROR));
        };
    }
}