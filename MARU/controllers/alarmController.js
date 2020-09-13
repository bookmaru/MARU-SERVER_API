const admin = require("firebase-admin");
const alarmModel = require('../models/alarm');
const firebaseConfig = require('../config/firebase.json');

const alarm = {
    alarm: async (req, res) => {
        const roomIdx = req.params.roomIdx;
        const deviceTokens = await alarmModel.getDeviceToken(roomIdx);
        const registrationTokens = [];

        for (let i = 0; i < deviceTokens.length; ++i) {
            registrationTokens.push(deviceTokens[i].deviceToken);
        }

        console.log(registrationTokens)
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
                title: "테스트",
                body: "테스트",
                sound: "default",
                click_action: "FCM_PLUGIN_ACTIVITY"
            },
            data: {
                test: "test가 성공적이네요 ~~ "
            }
        };

        admin.messaging().sendToDevice(registrationTokens, payload, options).then(function (response) {
            console.log('성공 메세지!' + response);
        }).catch(function (error) {
            console.log('보내기 실패 : ', error);
        });
    }
}

module.exports = alarm;