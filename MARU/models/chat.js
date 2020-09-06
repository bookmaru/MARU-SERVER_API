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

//채팅방 벗어난 후 안읽은 메세지 가져오기
getUnread: async (roomIdx, userIdx) => {
  const query = `select distinct c.nickName, c.msg, c.chatTime, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx} and c.chatTime > (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx})`;
 console.log(query)
  try {
    const result = await pool.queryParamArr(query);
    console.log(result)
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
},

getCount: async (roomIdx, userIdx) => {
  const query = `select count(*) as count from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx} and c.chatTime> (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx})`;
  try {
    const result = await pool.queryParam(query);
    console.log(result)
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
},
}

module.exports = chat;

