const pool = require('../modules/pool');

const alarm = {
    getDeviceToken: async (roomIdx) => {
        const query =  `SELECT u.deviceToken 
                        FROM user u JOIN participant p ON u.userIdx = p.userIdx
                        WHERE p.roomIdx =${roomIdx} AND p.disconnectFlag = 0`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = alarm;