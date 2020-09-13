const admin = require("firebase-admin");
const alarmModel = require('../models/alarm');
const firebaseConfig = require('../config/firebase.json');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const alarm = {
    alarm: async (req, res) => {
        const roomIdx = req.params.roomIdx;
        try {
            const deviceTokens = await alarmModel.getDeviceToken(roomIdx);
            const registrationTokens = [];

            for (let i = 0; i < deviceTokens.length; ++i) {
                registrationTokens.push(deviceTokens[i].deviceToken);
            }
            console.log(registrationTokens);

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
                    title: "새로운 메세지가 왔습니다",
                    body: "새로운 메세지가 왔습니다",
                },
                data: {
                    test: "test가 성공적이네요 ~~ "
                }
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