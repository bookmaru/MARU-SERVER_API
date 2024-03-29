const pool = require('../modules/pool');
const table = 'user';

const user = {
  signup : async (id,  password, salt, nickName, rating, count, deviceToken) => {
    const fields = 'id, password, salt, nickName, rating, count, deviceToken';
    const questions = `?, ?, ?, ?, ?, ?, ?`;
    const values = [id, password, salt, nickName, rating, count, deviceToken];
    const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
    try {
      const result = await pool.queryParamArr(query, values);
      const insertId = result.insertId;
      return insertId;
    } catch(err) {
    if (err.errno == 1062) {
      console.log('signup ERROR : ', err.errno, err.code);
      throw err;
    }   
  }
  },
  profile : async (userIdx) => {
    const query = `SELECT nickName, round((rating/count),1) as avgRating FROM ${table} WHERE userIdx="${userIdx}"`;
    try {
      const result = await pool.queryParam(query);
      if (result[0].avgRating == null){
        result[0].avgRating = 0;
      }
      return result[0];
    } catch (err) {
      console.log('profile ERROR : ', err);
      throw err;
    }
  },
  checkUser : async (id) => {
    const query = `SELECT * FROM ${table} WHERE id="${id}"`;
    try {
      const result = await pool.queryParam(query);
      if (result.length === 0) {
        return false;
      } 
      return true;
    } catch (err) {
      console.log('checkUser ERROR : ', err);
      throw err;
    }
  },
  checkUserNick : async (nickName) => {
    const query = `SELECT * FROM ${table} WHERE nickName="${nickName}"`;
    try {
      const result = await pool.queryParam(query);
      if (result.length === 0) {
        return false;
        } 
      return true;
    } catch (err) {
      console.log('checkUserNick ERROR : ', err);
      throw err;
    }
  },
  findByUserId : async (id) => {
    const query = `SELECT * FROM ${table} WHERE id="${id}"`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log('checkUser ERROR : ', err);
      throw err;
    }
  },
  getUserById : async (id) => {
    const query = `SELECT * FROM ${table} WHERE userIdx="${id}"`;
    try {
      return await pool.queryParam(query);
    } catch (err) {
      console.log('getUserById ERROR : ', err);
      throw err;
    }
  },
  getUserByIdx : async (idx) => {
    const query = `SELECT * FROM ${table} WHERE userIdx="${idx}"`;
    try {
      return await pool.queryParam(query);
    } catch (err) {
      console.log('getUserByIdx ERROR : ', err);
      throw err;
    }
  },
  rating : async (nickName, rating) => {
    const query = `UPDATE ${table} SET rating = rating+ ${rating}, count = count+1 WHERE nickName = "${nickName}" `;
    try{
      return await pool.queryParam(query);
    } catch (err) {
      console.log('rating ERROR : ', err);
      throw err;
    }
  },

  withdrawal : async (userIdx) => {
    const query = `DELETE FROM ${table} WHERE userIdx = ${userIdx} `;
    try{
      const result = await pool.queryParam(query);
      if (result.length === 0) {
        return false;
      } 
      return true;
    } catch (err) {
      console.log('withdrawal ERROR : ', err);
      throw err;
    }
  },

  myRoomList: async (userIdx) => {
    const query = `select distinct (select nickName from user where userIdx=r.userIdx) as leaderNickName, p.roomIdx, r.thumbnail, r.authors, r.title, r.info, r.createdAt from room r join ${table} u on r.userIdx join participant p on p.roomIdx = r.roomIdx where u.userIdx = ${userIdx} and r.roomIdx in (select p.roomIdx from participant p where p.userIdx=${userIdx}) and r.expired = 'false'`;
    try {
      const result = await pool.queryParam(query);
      return result;
    } catch (err) {
      console.log(err);
    }

  },

  updateRefreshToken: async (userIdx, refreshToken) => {
    const query = `UPDATE ${table} SET refreshToken = "${refreshToken}" WHERE userIdx = ${userIdx}`;
    try {
        const result = await pool.queryParam(query);
    } catch (err) {
        console.log('checkUser ERROR : ', err);
        throw err;
    }

  }, 

  report: async (reporterIdx, reportMsg, reportNickName) => {
    const fields = 'reporterIdx, reportMsg, reportNickName';
    const questions = `?,?,?`;
    const values = [reporterIdx, reportMsg, reportNickName];
    const query = `INSERT INTO report (${fields}) VALUES(${questions})`;
    try {
      const result = await pool.queryParamArr(query, values);
      const insertId = result.insertId;
      return insertId;
    } catch(err) {
    if (err.errno == 1062) {
      console.log('report ERROR : ', err.errno, err.code);
      throw err;
    }   

  }
},

  updateToken: async(userIdx, deviceToken) => {
    const query = `UPDATE ${table} SET deviceToken = "${deviceToken}" WHERE userIdx = ${userIdx}`;
    try {
      const result = await pool.queryParam(query);
  } catch (err) {
      console.log('Update Device Token ERROR : ', err);
      throw err;
  }
  },

  checkDeviceToken: async (deviceToken) => {
    const query = `SELECT * FROM ${table} WHERE deviceToken = "${deviceToken}"`;
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
  }
  
}

module.exports = user;