const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportlogin = require('../controller/passportlogin')
const authMiddleware = require('../middlewares/authMiddleware')
// const {isLoggedIn, isNotLoggedIn} = require('../middlewares/passportmid')

router.post('/login',passportlogin.create);

router.get('/logout',(req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).send({ result: "test", msg: "mytest." });
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  passportlogin.kakao;
});



module.exports = router;