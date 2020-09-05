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

    // 토론방에 방장 userIdx추가 - participant 테이블
    addUser : async (userIdx, roomIdx) => {
      const fileds = 'userIdx, roomIdx';
      const questions = `?, ?`;
      const values = [userIdx, roomIdx];
      const query = `INSERT INTO participant(${fileds}) VALUES(${questions})`; 
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
  },
  mainRoom: async (roomIdx) => {
    const query = `SELECT r.thumbnail, r.title, r.authors, r.createdAt, r.info, u.nickName,
                  round((u.rating / u.count), 1) as avgRating, 
                  (SELECT COUNT(p.userIdx) FROM participant p WHERE p.roomIdx = "${roomIdx}") as peopleCount
                  FROM room r JOIN user u ON (r.userIdx = u.userIdx)
                  WHERE r.roomIdx = "${roomIdx}"`;
    try {
        const result = await pool.queryParamArr(query);
        return result;
    } catch (err) {ㅇ
        if (err.errno == 1062) {
            console.log('duplicate ERROR : ', err.errno, err.code);
            throw err;
        }
        console.log('mainRoom error : ', err);
        throw err;
    }  
},
quizRoom: async (userIdx, roomIdx) => {
    const query = `SELECT room.quiz1, room.quiz2, room.quiz3, room.quiz4, room.quiz5, room.answer1, room.answer2, room.answer3, room.answer4, room.answer5 
                  FROM room WHERE room.userIdx = "${userIdx}" AND room.roomIdx = "${roomIdx}"`;
    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        if( err.errno ==1062 ) {
            console.log('duplicate ERROR : ', err.errno, err.code);
            throw err;
        }
        console.log('read quiz error : ', err);
        throw err;
    }
},

   // roomIdx 가져오기
  getRoomIdx: async (userIdx) => {
    const query = `SELECT roomIdx FROM ${table} WHERE userIdx = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
      return result[0].roomIdx;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // 퀴즈 합격
  quizPass: async(userIdx, roomIdx) => {
    const query = `INSERT INTO participant (userIdx, roomIdx) VALUES (${userIdx}, ${roomIdx})`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // 퀴즈 불합격
  quizFail: async (userIdx, roomIdx) => {
    const query = `INSERT INTO quizFail (userIdx, roomIdx, entry) VALUES (${userIdx}, ${roomIdx}, 'FAIL')`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
}

module.exports = room;