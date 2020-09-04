const pool = require('../modules/pool');
const table = 'chat';

const chat = {
  //채팅 보낼때마다 db에 저장
  sendChat :  async (userIdx, msg, chatTime, roomIdx) => {
    const fileds = 'userIdx, msg, chatTime, roomIdx';
    const questions = `?, ?, ?, ?`;
    const values = [userIdx, msg, chatTime, roomIdx];
    const query = `INSERT INTO ${table}(${fileds}) VALUES(${questions})`; 
    try {
      const result = await pool.queryParamArr(query, values);
      return result.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
},

//db에서 내용 가져오기
  getChat: async (roomIdx) => {
    const query = `SELECT * FROM ${table} WHERE roomIdx = ${roomIdx}`;
    try {
      const result = await pool.queryParamArr(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
},

}

module.exports = chat;

