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
getUnread: async (roomIdx1, roomIdx2, roomIdx3, userIdx) => {
  const query = `(select distinct c.nickName, c.msg, c.chatTime, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx1} and c.chatTime >= (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx1}) order by chatTime desc limit 1)
  union all (select distinct c.nickName, c.msg, c.chatTime, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx2} and c.chatTime >= (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx2}) order by chatTime desc limit 1)
  union all (select distinct c.nickName, c.msg, c.chatTime, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx3} and c.chatTime >= (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx3}) order by chatTime desc limit 1)`;
  try {
    const result = await pool.queryParamArr(query);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
},

getAlready: async (roomIdx1, roomIdx2, roomIdx3) => {
  const query = `(select distinct c.nickName, c.msg, c.chatTime, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx1} order by chatTime desc limit 1)
  union all (select distinct c.nickName, c.msg, c.chatTime, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx2} order by chatTime desc limit 1)
  union all (select distinct c.nickName, c.msg, c.chatTime, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx3}  order by chatTime desc limit 1)`;
  try {
    const result = await pool.queryParamArr(query);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
},

getCount: async (roomIdx1, roomIdx2, roomIdx3, userIdx) => {
  const query = `(select count(distinct c.nickName, c.msg, c.chatTime, c.roomIdx) as count, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx1} and c.chatTime > (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx1}))
  union all (select  count(distinct c.nickName, c.msg, c.chatTime, c.roomIdx) as count, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx2} and c.chatTime > (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx2}))
  union all (select  count(distinct c.nickName, c.msg, c.chatTime, c.roomIdx) as count, c.roomIdx from ${table} c join participant p on c.roomIdx = p.roomIdx where c.roomIdx=${roomIdx3} and c.chatTime > (select disconnectTime from participant where userIdx = ${userIdx} and roomIdx=${roomIdx3}))`;
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

