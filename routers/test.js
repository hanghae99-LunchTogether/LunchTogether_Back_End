const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportlogin = require('../controller/passportlogin')

router.post('/login',passportlogin.create);

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;