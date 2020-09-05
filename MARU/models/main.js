const pool = require('../modules/pool');
const table = 'room';

const main = {
  // 모임이 많은 책
  ManyRoom: async () => {
    const query = `SELECT thumbnail, title, authors, count(title) as roomCount from room GROUP BY title ORDER BY roomCount DESC LIMIT 0, 10`; 
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // 새로나온 모임 
  newRoom: async(pageStart, pageEnd) => {
    const query = `SELECT r.roomIdx, r.thumbnail, r.authors, r.title, r.info, u.nickName FROM room r JOIN user u ON r.userIdx = u.userIdx ORDER BY roomIdx DESC LIMIT ${pageStart}, ${pageEnd}`;
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



