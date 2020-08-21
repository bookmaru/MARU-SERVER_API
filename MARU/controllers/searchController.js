const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const request = require('request');
const kakaoOptions = require('../config/kakao');

const search = {
  kakao: async (req, res) => {
    const { title } = req.query;
    const test = await kakaoOptions.kakaoTest(title);

    request(test, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        console.log(JSON.parse(body).documents[0].authors[0]);
        console.log(JSON.parse(body).documents[0].datetime);
        console.log(JSON.parse(body).documents[0].isbn);
      }
    })
  }
}

module.exports = search;