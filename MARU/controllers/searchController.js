const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const request =require('request');

const search = {
    kakao: async(req, res) => {
        const title = req.params.query;
        console.log(title);
        let kakaoOptions = {
            url: `https://dapi.kakao.com/v3/search/book?target=title`,
            method: 'GET',
            headers: {
              'Authorization': 'KakaoAK 54f68eef8be876e948d2c00d2600e636'
            },
            qs: {
              query : title
            },
            encoding: 'UTF-8',
          }

          // request(kakaoOptions, function (err, res, body) {
          //   if (!err && res.statusCode == 200) {
          //        console.log(JSON.parse(body))
          //     console.log(JSON.parse(body).documents[0].title);
          //     console.log(JSON.parse(body).documents[0].authors[0]);
          //     console.log(JSON.parse(body).documents[0].datetime);
          //     console.log(JSON.parse(body).documents[0].isbn);
          //   }  
          // })
        
        }
}
module.exports = search;