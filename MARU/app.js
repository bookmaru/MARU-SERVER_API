const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const fs = require('fs')
const io = socket.listen(server)
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


    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });

      socket.on('leaveRoom', (roomIdx, name) => {
        socket.leave(room[roomIdx], () => {
          console.log(name + ' leave a ' + room[roomIdx]);
          io.to(room[roomIdx]).emit('leaveRoom', roomIdx, name);
        });
      });

      socket.on('leave', (name, roomIdx) => {
        var date=new Date();
        let disconnectTime = moment(date).format('YYYY-MM-DD HH:mm:ss');

        const fileds = 'disconnectTime';
        const questions = `?`;
        const values = [disconnectTime];
        const query = `UPDATE participant SET ${fileds} = ${questions} WHERE userIdx = (select userIdx from user where nickName = "${name}") and roomIdx=${roomIdx}`; 
        const  result = pool.queryParamArr(query,values)
        console.log(query)
        console.log(result)
      });


      socket.on('joinRoom', (roomIdx, name) => {
        socket.join(room[roomIdx], () => {
          room.push('room'+roomIdx);
          console.log(room)
          console.log(name + ' join a ' + room[roomIdx]);
          //console.log(Object.keys(io.sockets.in(room[num]).connected).length)
          io.to(room[roomIdx]).emit('joinRoom', roomIdx,name);
        });
      });


      socket.on('chat message', (name, msg, roomIdx) => {
        a=roomIdx;
        var date = new Date(); 
        let chatTime = moment(date).format('YYYY-MM-DD HH:mm:ss');

        console.log(name, msg, chatTime, roomIdx+1)

        const fileds = 'nickName, msg, chatTime, roomIdx';
        const questions = `?, ?, ?, ?`;
        const values = [name, msg, chatTime, roomIdx + 1];
        const query = `INSERT INTO chat(${fileds}) VALUES(${questions})`; 

        const result = pool.queryParamArr(query,values)
        console.log(result)
        io.to(room[a]).emit('chat message', name, msg);
      });

      });
    });


module.exports = app;