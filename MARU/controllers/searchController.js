const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const request = require('request');
const kakaoOptions = require('../config/kakao');
const searchModel = require('../models/search');
const user = require('../models/user');
const roomModel = require('../models/room');
const jwt = require('../modules/jwt');
const Hangul = require('hangul-js');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;;

const search = {

  /** 
     * @summary 토론방 만들기 위해 책 검색
     * @param 책 제목(title)
     * @return author, title, thumbnail
     */
  kakao: async (req, res) => {
    const { title } = req.query;

    const kakao = await kakaoOptions.kakaoTest(title);

    if (!title) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    request(kakao, function (err, response, body) {
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
  },

   /** 
     * @summary 개설된 토론방 검색
     * @param 책 제목(title)
     * @return author, title, thumbnail, info, nickName, time
     */
  room : async (req, res) => {
    const { title, pageStart, pageEnd } = req.query;
    
    if (!title || pageStart === undefined || pageEnd === undefined) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    const token = req.headers.token;
    // 모든 공백을 제거하는 정규식
    const searchKeyword = title.replace(/(\s*)/g,"");
    const consonantVowel = Hangul.disassemble(searchKeyword);

    // 자모음 분리 결과가 배열이라 문자열로 합치기
    const titleConsonatVowel = consonantVowel.join("");

    // 비회원 유저
    if (!token) {
      try {  
        const result = await searchModel.NotLoginUserSearch(titleConsonatVowel, pageStart, pageEnd);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SEARCH, result));
        return;
      } catch (err) {
        console.log(err);
        res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
        return;
      }
    };

    const user = await jwt.verify(token);

    if (user === TOKEN_EXPIRED) {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
    }

    if (user === TOKEN_INVALID) {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }

    if (user.userIdx === undefined) {
        return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }

    // 로그인 유저 검색
    try {
      const roomResult = await searchModel.searchRoom(titleConsonatVowel, user.userIdx);
      const getExpired = await roomModel.getExpired();

      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SEARCH, roomResult));
      return;
    } catch (err) {
      console.log(err);
      res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.SERVER_ERROR));
      return;
    }
  }
}

module.exports = search;