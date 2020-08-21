const pool = require('../modules/pool');
const { queryParamArr } = require('../modules/pool');
const table = 'room';

const room = {
  make : async (thumbnail, authors, title, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx) => {
    const fileds = 'thumbnail, authors, title, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx';
    const questions = `?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`;
    const values = [thumbnail, authors, title, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx];
    const query = `INSERT INTO ${table}(${fileds}) VALUES(${questions})`; 
    try {
      const result = await pool.queryParamArr(query, values);
      return insertId = result.insertId;
      return insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = room;