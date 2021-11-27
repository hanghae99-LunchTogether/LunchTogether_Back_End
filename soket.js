const SocketIO = require('socket.io');
const axios = require('axios');
var ios = require("express-socket.io-session");
// const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' },{cors: {
    origin: '*',
  }});
  app.set('io', io);
  const room = io.of('/rooms');
  const chat = io.of('/chat');
  chat.use(ios(sessionMiddleware, { autoSave:true }));

  const test = io.of('/test');

  test.on('connection', (socket) => {
    
    socket.on('join', ({ name, room }, callback) => {
      socket.emit("message","서버에서 메세지");
    });
  
    socket.on('sendMessage', (message) => {
      console.log("메세지 받앗어요.", message);
      // setTimeout(() => {
      //   console.log("메세지 보냈어요.")
      //   socket.emit("message","서버에서 메세지");
      // }, 2000);
    });
  
    socket.on('disconnect', () => {
      console.log("연결종료")
    })
  });




  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.handshake;
    console.log(req);
    const { headers: { referer } } = req;
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    socket.join(roomId);
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if (userCount === 0) { // 유저가 0명이면 방 삭제
        axios.delete(`http://localhost/room/${roomId}`, {
          headers: {
            Cookie: socket.handshake.headers.cookie
          } 
        })
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
    socket.on('chat', (data) => {
      socket.to(data.room).emit(data);
    });
  });

};