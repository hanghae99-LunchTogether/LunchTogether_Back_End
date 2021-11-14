const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/pssportmid');
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/test', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(400).send({ result: "fail", msg: info.message });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      const token = jwt.sign(
        {
          id: user["userid"],
          nickname: user["nickname"],
        },
        process.env.SECRET_KEY
      );
      const data = { user: user };
      return res.status(200).send({
        result: "success",
        msg: "로그인 완료.",
        token: token,
        data: data,
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
//isLoggedIn,
router.get('/logout',  (req, res) => {
  // req.logout();
  // req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;