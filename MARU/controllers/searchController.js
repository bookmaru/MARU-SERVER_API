const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const request = require('request');
const kakaoOptions = require('../config/kakao');

const search = {

  /** 
     * @summary 토론방 만들기 위해 책 검색
     * @param 책 제목(title)
     * @return author, title, thumbnail
     */
  kakao: async (req, res) => {
    const { title } = req.query;
    const test = await kakaoOptions.kakaoTest(title);

    if (!title) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    request(test, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        const book = JSON.parse(body).documents;
        
        // 검색한 결과가 존재하지 않을 때
        if (book.length === 0) {
          res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH));
          return;
        }

        // 검색 결과가 존재할 때
        bookList = [];
        
        for (let item of book) {
          bookList.push({
            authors : item.authors[0],
            title : item.title,
            thumbnail : item.thumbnail
          })
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SEARCH, bookList))

      }
      // KAKAO API 불러오기 실패
      else {
        res,status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR))
      }
    })
  }
}

module.exports = search;