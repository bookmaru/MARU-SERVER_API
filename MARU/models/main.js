const pool = require('../modules/pool');
const table = 'room';

const main = {
  // Main View
  ManyRoom: async () => {
    const query = `SELECT roomIdx, thumbnail, authors, title, COUNT(*) as roomCount FROM ${table} GROUP BY title ORDER BY roomCount DESC LIMIT 0, 9`; 
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  newRoom: async(pageStart, pageEnd) => {
    const query = `SELECT r.thumbnail, r.authors, r.title, r.info, u.nickName FROM room r JOIN user u ON r.userIdx = u.userIdx ORDER BY roomIdx DESC LIMIT ${pageStart}, ${pageEnd}`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  
}

module.exports = main;

