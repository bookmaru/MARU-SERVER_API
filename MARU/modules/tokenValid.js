const util = require('./util');
const resMessage = require('./responseMessage');
const statusCode = require('./statusCode');
const UserModel = require('../models/user');
const jwt = require('./jwt');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  tokenValid: async (token) => {
    const user = await jwt.verify(token);
    if (user === TOKEN_EXPIRED) {
      return -1;
    }

    if (user === TOKEN_INVALID) {
      return -2;
    }

    if (user.userIdx === undefined) {
      return -3;
    }

    return 1;
  }
}