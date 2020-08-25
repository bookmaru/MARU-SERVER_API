const pool = require('../modules/pool');
const table = 'room';

const room = {
  // 토론방 개설
  make : async (thumbnail, authors, title, info, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx) => {
    const fileds = 'thumbnail, authors, title, info, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx';
    const questions = `?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`;
    const values = [thumbnail, authors, title, info, quiz1, quiz2, quiz3, quiz4, quiz5, answer1, answer2, answer3, answer4, answer5, createdAt, userIdx];
    const query = `INSERT INTO ${table}(${fileds}) VALUES(${questions})`; 
    try {
      const result = await pool.queryParamArr(query, values);
      return result.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // 토론방 방장 제한
  limitMakeRoom: async (userIdx) => {
    const query = `SELECT * FROM ${table} WHERE userIdx = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      if (result.length === 0) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // 토론방 참여 제한
  limitJoin: async (userIdx) => {
    const query = `SELECT * FROM participant WHERE userIdx = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      if (result.length < 2) {
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = room;