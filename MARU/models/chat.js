const pool = require('../modules/pool');
const table = 'chat';

const chat = {
  sendChat :  async (userIdx, roomIdx) => {
    const fileds = 'userIdx, roomIdx';
    const questions = `?, ?`;
    const values = [userIdx, roomIdx];
    const query = `INSERT INTO ${table}(${fileds}) VALUES(${questions})`; 
    try {
      const result = await pool.queryParamArr(query, values);
      return result.insertId;
    } catch (err) {
      console.log(err);
      throw err;
    }
}
}

module.exports = chat;

