const admin = require("firebase-admin");
const alarmModel = require('../models/alarm');
const firebaseConfig = require('../config/firebase.json');

const alarm = {
    alarm : async (req, res) => {
        const roomIdx = req.params.roomIdx;
        const deviceTokens = await alarmModel.getDeviceToken(roomIdx);
        const registrationTokens = [];

        for (let i = 0; i < deviceTokens.length; ++i) {
            registrationTokens.push(deviceTokens[i].deviceToken);
        }
        console.log(registrationTokens)
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: "https://maru-40810.firebaseio.com"
        });
 
        var message = {
            data: {
                score: '850',
                time: '2:45'
            },
            token: registrationTokens[0],
        };

          // Send a message to the device corresponding to the provided
          // registration token.
        admin.messaging().sendToDevice(message)
            .then((response) => {
              // Response is a message ID string.
            console.log('Successfully sent message:', response);
            })
            .catch((error) => {
            console.log('Error sending message:', error);
            })
    }
}

module.exports = alarm;