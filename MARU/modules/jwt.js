const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey').secretKey;
const options = require('../config/secretKey').options;
const refreshOptions = require('../config/secretKey').refreshOptions;
const UserModel = require('../models/user');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async (user) => {
        const payload = {
            idx: user.userIdx
        };
        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: jwt.sign(payload, secretKey, refreshOptions)
        };
        
        // refreshToken Update 
        await UserModel.updateRefreshToken(payload.idx, result.refreshToken);
        return result;
    },

    // 디코딩 해줌 => (jwt.io 참고)
    verify: async (token) => {
        let decoded;
        try {
            // 디코딩할 때도 idx와 name으로 분리해서 옴 
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token')
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    },

    // refreshToken Verify
    refresh: async (refreshToken) => {
        try {
            const result = jwt.verify(refreshToken, secretKey);

            if (result.idx === undefined) {
                return TOKEN_INVALID;
            }

            const user = await UserModel.getUserByIdx(result.idx);

            if (refreshToken !== user[0].refreshToken) {
                console.log('invalid refresh token');
                return TOKEN_INVALID;
            }
            const payload = {
                userIdx: user[0].userIdx
            };
            const dto = {
                token: jwt.sign(payload, secretKey, options),
                refreshToken: jwt.sign(payload, secretKey, refreshOptions)
            };
            await UserModel.updateRefreshToken(payload.userIdx, dto.refreshToken);
            return dto;
        } catch (err) {
            console.log('jwt.js ERROR : ', err);
            throw err;
        }
    }
}