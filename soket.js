const SocketIO = require('socket.io');
const axios = require('axios');
var ios = require("express-socket.io-session");
// const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');
const redisClient = require('./config/redis');
const redis = require('socket.io-redis');
const { notice } = require("../models");



module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' },{cors: {
    origin: '*',
  }});
  // io.use(ios(sessionMiddleware, { autoSave:true }));
  // io.adapter(redis({
  //   host: process.env.Redisend,
  //   port: process.env.RedisPort,
  //   password: process.env.Redispassword
  // }));
  // io.use(function(socket, next){
  //   // Wrap the express middleware
  //   sessionMiddleware(socket.request, socket.request.res, next);
  // })
  app.set('io', io);
  // io.adapter(redis({
  //   host: process.env.Redisend,
  //   port: process.env.Redispassword
  // }));
  // io.use(function(socket, next) {
  //   sessionMiddleware(socket.request, socket.request.res, next);
  // });
  const room = io.of('/rooms');
  room.use(ios(sessionMiddleware, { autoSave:true }));
  const chat = io.of('/chat');
  chat.use(ios(sessionMiddleware, { autoSave:true }));

  const test = io.of('/userin');
  test.use(ios(sessionMiddleware, { autoSave:true }));
  test.on('connection', (socket) => {
    console.log("클라이언트 연결")
    const redis = redisClient;
    let userid;
    // console.log(socket.handshake.session);
        
    // socket.emit("message","서버에서 메세지");
    socket.on('join', (massage) => {
      console.log(massage);
      // redisClient.hset("inneruser",socket.handshake.session.passport.user)
      // socket.emit("message",socket.handshake.session.passport.user+"접속확인"+massage);
      console.log(socket.handshake.session);
      if(socket.handshake.session.passport){
        userid = socket.handshake.session.passport.user
        redis.hset('users', userid, socket.id);
        redis.hget('users', userid, function(err, obj){
          if(err){
            console.log(err)
            test.to("message").emit("연결실패..!")
          }
          console.log(obj)
          const notices =  await notice.findAll({where: { userid: userid }})
          // test.to(obj).emit("message",socket.handshake.session.passport.user+"접속확인"+ massage);
          test.to(obj).emit("message", notices );
        })
      }else{
        test.to(socket.id).emit("message","로그인 안됬음..!");
      }
      // test.to(socket.id).emit("message",socket.handshake.session.passport.user+"접속확인"+ massage);
    });
  
    socket.on('sendMessage', (message) => {
      console.log("메세지 받앗어요.", socket.handshake.session);
      // setTimeout(() => {
      //   console.log("메세지 보냈어요.")
      //   socket.emit("message",socket.handshake.session.passport.user+"접속확인");
      // }, 2000);
    });
  
    socket.on('disconnect', () => {
      if(userid){
        redisClient.hdel("users", userid);
      }
      console.log("연결종료")
    })
  });




  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    console.log(socket.handshake.session);
    if(socket.handshake.session.passport){
      if(socket.handshake.session.passport.user){
        const req = socket.handshake.session.passport.user;
        console.log(req, redisClient);
        const redis = redisClient;
        redis.hset('users', req, socket.id);
        redis.hget('users', req,function(err, obj){
          if(err)console.log(err)
          console.log(obj)
        })
      }
    }
    socket.on('disconnect', () => {
      redisClient.hDel("users", req);
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.handshake;
    // const req = socket.request;
    // console.log(req);
    const { headers: { referer } } = req;
    console.log(referer);
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
        axios.delete(`https://lebania.shop/test/room/${roomId}`, {
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