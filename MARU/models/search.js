const pool = require('../modules/pool');
const table = 'room';

const search = {
  // 인원이 5명 미만인 채팅방만 나오는 쿼리
  searchRoom : async (title) => {
    const query = `SELECT r.thumbnail, r.title, r.authors, r.info, u.nickName FROM ${table} r JOIN user u ON r.userIdx = u.userIdx WHERE r.title LIKE '%${title}%' GROUP BY r.roomIdx HAVING count(r.userIdx) < 5`;
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