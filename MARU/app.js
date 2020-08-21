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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const chat = require('./routes/chat');
const { connected } = require('process');
app.use('/chat', chat);
app.use('/', indexRouter);
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))
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

// server.listen(app.get('port'), function(){

//   console.log("Express server listening on port " + app.get('port'));

// });
server.listen(8080, function(){

  console.log("Express server listening on port " + 8080);

});


/* Get 방식으로 / 경로에 접속하면 실행 됨 */
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
let room = ['room1', 'room2', 'room3'];
let a = 0;

io.on('connection', (socket) => {
  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });


  // socket.on('leaveRoom', (num, name) => {
  //   socket.leave(room[num], () => {
  //     console.log(name + ' leave a ' + room[num]);
  //     io.to(room[num]).emit('leaveRoom', num, name);
  //   });
  // });


  socket.on('joinRoom', (num, name,cnt) => {
    var cnt=Object.keys(io.sockets.in(room[num]).connected).length //room마다 다르게 고칠 것
    socket.join(room[num], () => {
      console.log(name + ' join a ' + room[num]);
      console.log(Object.keys(io.sockets.in(room[num]).connected).length)
      io.to(room[num]).emit('joinRoom', num, name,cnt);
    });
  });


  socket.on('chat message', (num, name, msg) => {
    a = num;
    io.to(room[a]).emit('chat message', name, msg);
  });


});

module.exports = app;