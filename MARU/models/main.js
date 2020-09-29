const pool = require('../modules/pool');
const table = 'room';

const main = {
  // 모임이 많은 책
  ManyRoom: async () => {
    const query = `SELECT thumbnail, title, authors, count(title) as roomCount from room  where expired = 'false' GROUP BY title ORDER BY roomCount DESC LIMIT 0, 10`; 
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // 비로그인 유저 새로나온 모임 
  NotLoginUserNewRoom: async(pageStart, pageEnd) => {
    const query = `SELECT r.roomIdx, r.thumbnail, r.authors, r.title, r.info, u.nickName FROM room r JOIN user u ON r.userIdx = u.userIdx where r.expired = 'false' ORDER BY roomIdx DESC LIMIT ${pageStart}, ${pageEnd}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } 
  },

  // 로그인 유저 새로나온 모임 
  LoginUserNewRoom: async(userIdx, pageStart, pageEnd) => {
    const query = `SELECT r.roomIdx, r.thumbnail, r.authors, r.title, r.info, u.nickName FROM room r JOIN user u ON r.userIdx = u.userIdx where r.expired = 'false' and r.roomIdx not in (select roomIdx from participant where userIdx = ${userIdx}) and r.roomIdx not in (select roomIdx from quizFail where userIdx = 1) and r.roomIdx not in (select roomIdx from participant group by roomIdx HAVING count(userIdx) >= 5) ORDER BY roomIdx DESC LIMIT ${pageStart}, ${pageEnd}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } 
  }
}

module.exports = main;



