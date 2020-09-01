const express = require('express');
const router = express.Router();
const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, {path: '/socket.io'});

  io.on('connection', (socket) => {
    const req = socket.request;
    

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });

    socket.on('error', (error) => {
      console.error(error);
    });

    socket.on('message', (error) => {
      console.error(error);
    });

    socket.on('reply', (data) => {
      console.log(data);
    })
  })
}



module.exports = router;