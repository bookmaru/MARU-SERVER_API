const pool = require('../modules/pool');
const table = 'room';

const search = {
  // 로그인 한 유저가 인원이 5명 미만 + 퀴즈에 불합격 하지 않은 모임만 나오는 쿼리
  searchRoom : async (title, userIdx) => {
    const query = `SELECT r.roomIdx, r.thumbnail, r.title, r.authors, r.info, u.nickName
                   FROM room r JOIN user u ON r.userIdx = u.userIdx 
                   JOIN participant p ON p.roomIdx = r.roomIdx 
                   JOIN quizFail q 
                   WHERE  r.title LIKE '%${title}%' and r.roomIdx not in (select roomIdx from quizFail where userIdx = ${userIdx})
                   GROUP BY r.roomIdx HAVING count(p.userIdx) < 5  `;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  NotLoginUserSearch: async (title) => {
    const query = `SELECT r.roomIdx, r.thumbnail, r.title, r.authors, r.info, u.nickName FROM room r JOIN user u ON r.userIdx = u.userIdx WHERE  r.title LIKE '%${title}%'`;
    try {
       const result = await pool.queryParam(query);
       return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = search;