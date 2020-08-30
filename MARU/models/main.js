const pool = require('../modules/pool');
const table = 'room';

const main = {
  // Main View
  view: async () => {
    const query = `SELECT roomIdx, thumbnail, authors, title, COUNT(*) as roomCount FROM ${table} GROUP BY title ORDER BY roomCount DESC LIMIT 0, 9`; 
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  newRoom: async() => {
    const query = `SELECT r.roomIdx, r.thumbnail, r.authors, r.title, r.info, u.nickName FROM room r JOIN user u ON r.userIdx = u.userIdx ORDER BY roomIdx DESC LIMIT 0, 9`;
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

