const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const commRouter = require("./comment");
const lunchRouter = require("./lunchlist");
const userReview = require("./userreview");
const applicantRouter = require("./applicant");
const bookRouter = require("./bookmark");
router.use("/", [userRouter]);
router.use("/comment", [commRouter]);
router.use("/lunchpost", [lunchRouter]);
router.use("/spoon", [userReview]);
router.use("/applicant", [applicantRouter]);
router.use("/book", [bookRouter]);

const { rooms, chats, lunchs} = require('../models')


router.get('/', async (req, res, next) => {
    try {
      const room = await rooms.findAll({});
      res.render('main', { room, title: 'GIF 채팅방' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성' });
  });
  
  router.post('/room', async (req, res, next) => {
    try {
      const newRoom = await rooms.create({
        title: req.body.title,
        mender: req.body.max,
        owner: req.session.color,
        password: req.body.password,
      });
      const io = req.app.get('io');
      io.of('/room').emit('newRoom', newRoom);
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  router.get('/room/:id', async (req, res, next) => {
    try {
      const room = await rooms.findOne({ id: req.params.id });
      const io = req.app.get('io');
      if (!room) {
        return res.redirect('/?error=존재하지 않는 방입니다.');
      }
      if (room.password && room.password !== req.query.password) {
        return res.redirect('/?error=비밀번호가 틀렸습니다.');
      }
      const { rooms } = io.of('/chat').adapter;
      if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
        return res.redirect('/?error=허용 인원이 초과하였습니다.');
      }
      const chat = await chats.findOne({ id: room._id }).sort('createdAt');
      return res.render('chat', {
        room,
        title: room.title,
        chat,
        user: req.session.color,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  
  router.delete('/room/:id', async (req, res, next) => {
    try {
      await rooms.remove({ id: req.params.id });
      await chats.remove({ id: req.params.id });
      res.send('ok');
      setTimeout(() => {
        req.app.get('io').of('/room').emit('removeRoom', req.params.id);
      }, 2000);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  router.post('/room/:id/chat', async (req, res, next) => {
    try {
      const chat = await chats.create({
        id: req.params.id,
        user: req.session.color,
        chat: req.body.chat,
      });
      req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
      res.send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
module.exports = router;
