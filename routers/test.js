const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportlogin = require('../controller/passportlogin')
const axios = require('axios');

router.post('/login',passportlogin.create);

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.status(200).send({ result: "test", msg: "mytest." });
});



module.exports = router;