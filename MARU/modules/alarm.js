var admin = require("firebase-admin");
const firebaseConfig = require("../config/firebase.json");

const alarm = {
    setSchedule: async (registerToken) => {
        await alarm.message(registerToken);
    },

    message: async (registerToken) => {
        var title = "테스트제목";
        var body = "테스트 바디! ";
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: '"https://maru-edb55.firebaseio.com"'
        });

        var options = {
            priority: 'high',
            timeToLive: 60 * 60 * 24 * 2
        };

        var payload = {
            notification: {
                title: title,
                body: body,
                sound: "default",
                click_action: "FCM_PLUGIN_ACTIVITY",
                icon: "fcm_push_icon"
            },
            data: {
                test: "test가 성공적이네요 ~~ "
            }
        };

        admin.messaging().sendToDevice(registerToken, payload, options).then(function (response) {
            console.log('성공 메세지!' + response);
            return response
        })
        .catch(function (error) {
            console.log('보내기 실패 : ', error);
        });
    },

}

module.exports = alarm;