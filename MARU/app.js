const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
const http = require('http')
const server = http.createServer(app) // http 서버를 연다 
const socket = require('socket.io')
const fs = require('fs')
const io = socket.listen(server)  // socket.io서버를 http에 연결해준다.
const moment = require('moment');
const pool = require('./modules/pool');
const chat = require('./routes/chat');
const mysql = require('mysql');
const configDB = require('./config/database2');

const connection = mysql.createConnection({
  host: configDB.host,
  port: configDB.port,
  user: configDB.user,
  password: configDB.password,
  database: configDB.database
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/chat/:roomIdx', chat);

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(8080, function(){
  console.log("Express server listening on port " + 8080);
});


/* GET 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function(request, response) {
  fs.readFile('./index.ejs', function(err, data) {
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})
  
connection.query('SELECT roomIdx FROM room', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    //console.log(results[0].count);
    let room = ['room0'];
    for( var i in results){
      room.push('room'+results[i].roomIdx)
    }
    // const getRoomCount = results[0].count;
    // let room = [];
    // for (i = 1; i <= getRoomCount; i++){
    //   room.push('room' + i)
    // }
    console.log(room)
    let a = 0 ;

// 'connection' 이벤트 발생
    io.on('connection', (socket) => {

      // 클라이언트 접속 끊을 시 on('disconnect') 발생
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
      // room 나가기 : socket.leave
      socket.on('leaveRoom', (roomIdx, name) => {
        socket.leave(room[roomIdx], () => {
          console.log(name + ' leave a ' + room[roomIdx]);
          io.to(room[roomIdx]).emit('leaveRoom', roomIdx, name);
        });
      });
      // 토론에서 벗어난 시간 체크
      socket.on('leave', (name, roomIdx) => {
        var date=new Date();
        let disconnectTime = moment(date).format('YYYY-MM-DD HH:mm:ss');

        const fields = 'disconnectTime';
        const questions = `?`;
        const values = [disconnectTime];
        const query = `UPDATE participant SET ${fields} = ${questions} WHERE userIdx = (select userIdx from user where nickName = "${name}") and roomIdx=${roomIdx}`; 
        const  result = pool.queryParamArr(query,values)
        console.log(query)
        console.log(result)
      });
      // room 접속  socket.join
      // 특정 room 에게 이벤트 보낼 시 : io.to('room이름').emit()
        socket.on('joinRoom', (roomIdx, name) => {
        socket.join(room[roomIdx], () => {
          room.push('room'+roomIdx);
          console.log(room)
          console.log(name + ' join a ' + room[roomIdx]);
          //console.log(Object.keys(io.sockets.in(room[num]).connected).length)
          io.to(room[roomIdx]).emit('joinRoom', roomIdx,name);
        });
      });

//클라 : socket.emit('chat message') , 서버 : socket.on('chat message') 매개변수 : name, msg, roomIdx
      socket.on('chat message', (name, msg, roomIdx) => {
        a=roomIdx;
        var date = new Date(); 
        let chatTime = moment(date).format('YYYY-MM-DD HH:mm:ss');

        console.log(name, msg, chatTime, roomIdx+1)

        const fields = 'nickName, msg, chatTime, roomIdx';
        const questions = `?, ?, ?, ?`;
        const values = [name, msg, chatTime, roomIdx];
        const query = `INSERT INTO chat(${fields}) VALUES(${questions})`; 

        const result = pool.queryParamArr(query,values)
        console.log(result)
        io.to(room[a]).emit('chat message', name, msg);
      });

      });
    });


module.exports = app;