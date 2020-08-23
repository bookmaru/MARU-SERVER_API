const pool = require('../modules/pool');
const table = 'user';

const user = {
    signup: async (id,  password, salt, nickName, rating) => {
        const fields = 'id, password, salt, nickName, rating';
        const questions = `?, ?, ?, ?, ?`;
        const values = [id, password, salt, nickName, rating];
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

    checkUser: async (id) => {
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
    checkUserNick: async (nickName) => {
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
    findByUserId: async (id) => {
        const query = `SELECT * FROM ${table} WHERE id="${id}"`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('checkUser ERROR : ', err);
            throw err;
        }
    },
    getUserById: async (id) => {
        const query = `SELECT * FROM ${table} WHERE userIdx="${id}"`;
        try {
            return await pool.queryParam(query);
        } catch (err) {
            console.log('getUserById ERROR : ', err);
            throw err;
        }
    },
    getUserByIdx: async (idx) => {
        const query = `SELECT * FROM ${table} WHERE userIdx="${idx}"`;
        try {
            return await pool.queryParam(query);
        } catch (err) {
            console.log('getUserByIdx ERROR : ', err);
            throw err;
        }
    },

    
}

module.exports = user;