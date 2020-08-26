const pool = require('../modules/pool');
const table = 'room';

const room = {
    mainRoom: async(roomIdx) => {
        const query = `SELECT r.thumbnail, r.title, r.authors, r.createdAt, r.info, u.nickName,
        round((u.rating/u.count),1) as avgRating, 
        (SELECT COUNT(chat.userIdx) - 1 FROM chat WHERE chat.roomIdx = "${roomIdx}") as peopleCount
        FROM room r JOIN user u ON (r.userIdx = u.userIdx)
        WHERE r.roomIdx = "${roomIdx}"`;
        try{
            const result = await pool.queryParamArr(query);
            return result;
        } catch(err) {
            if (err.errno == 1062) {
                console.log('duplicate ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('mainRoom error : ', err);
            throw err;
        }  
    },
    quizRoom: async(userIdx, roomIdx)=>{
        const query = `SELECT room.quiz1, room.quiz2, room.quiz3, room.quiz4, room.quiz5, room.answer1, room.answer2, room.answer3, room.answer4, room.answer5 
        FROM room WHERE room.userIdx = "${userIdx}" AND room.roomIdx = "${roomIdx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        } catch(err){
            if( err.errno ==1062 ) {
                console.log('duplicate ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('read quiz error : ', err);
            throw err;
        }
    }
}

module.exports = room;