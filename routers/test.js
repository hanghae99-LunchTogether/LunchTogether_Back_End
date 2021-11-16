const express = require('express');
const passport = require('passport');
const router = express.Router();
const passportlogin = require('../controller/passportlogin')
const jwt = require("jsonwebtoken");

router.post('/login',passportlogin.create);

router.get('/logout',(req, res)=>{
  res.status(200).send({
    message: "테스트성공",
  });
})

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  try {
    console.log("여기서 테스트 한번 합시다.");
    console.log(req.session);
    const user = req.user;
    const token = jwt.sign(
      {
        id: user["userid"]
      },
      process.env.SECRET_KEY
    );
    const data = { user: user };
    res.status(200).send({
      message: "로그인에 성공하였습니다.",
      data: data,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
});



module.exports = router;