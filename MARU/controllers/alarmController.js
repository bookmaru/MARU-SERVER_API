const admin = require("firebase-admin");
const alarmModel = require('../models/alarm');
const firebaseConfig = require('../config/firebase.json');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const alarm = {

    /** 
      * @summary 채팅 알람
      * @param roomIdx
      * @param title, nickName, message
      * @return 
    */
    alarm: async (req, res) => {
        const roomIdx = req.params.roomIdx;
        const {title, nickName, message} = req.body;

        if (!roomIdx || !title || !nickName || !message) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        try {
            const deviceTokens = await alarmModel.getDeviceToken(roomIdx, nickName);
            const registrationTokens = [];

            if (deviceTokens.length === 0) {
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ALARM));
                return;
            }

            for (let i = 0; i < deviceTokens.length; ++i) {
                registrationTokens.push(deviceTokens[i].deviceToken);
            }

            if (registrationTokens.length === 0) {
                res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.NO_ALARM));
                return;
            }
            

            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(firebaseConfig),
                    databaseURL: "https://maru-40810.firebaseio.com"
                });
            }
            var options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24 * 2
            };

            var payload = {
                notification: {
                    title: title,
                    body: nickName + " : " + message,
                },
            };

            admin.messaging().sendToDevice(registrationTokens, payload, options).then(function (response) {
                console.log('성공 메세지!' + response);
                res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_ALARM));
                return;
            }).catch(function (error) {
                console.log('보내기 실패 : ', error);
                res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.INTERNAL_SERVER_ERROR));
                return;
            });
        } catch (err) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.INTERNAL_SERVER_ERROR));
            return;
        }
    }
}

module.exports = alarm;