const pool = require('../modules/pool');

const alarm = {
    getDeviceToken: async (roomIdx, nickName) => {
        const query =  `SELECT u.deviceToken FROM user u JOIN participant p ON u.userIdx = p.userIdx
                        WHERE p.roomIdx =${roomIdx} AND p.disconnectFlag = 0 AND u.userIdx not in (SELECT userIdx FROM user WHERE nickName = "${nickName}")`;
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