// 2
const express = require("express");
const router = express.Router();
const { users } = require("../models");
const passport = require("passport");
const { info } = require("winston");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/psMiddleware");
const { logger } = require("../config/logger");

// 회원가입
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await users.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await users.create({
      email,
      nickname,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      // user에 exUser 전달받음
      // serialize 호출
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

// 로그아웃
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(); // req.user 삭제
  req.session.destroy(); // req.user in fact, not needed
  res.redirect("/");
});

// kakao login Router
router.get("/kakao", passport.authenticate("kakao"));
// 처음에 카카오 로그인 창으로 리다이렉트. 그 창에서 로그인 후 성공 여부를 /kakao/callback으로 받음

router.get(
  "/kakao/callback", // 로그인 성공여부 검사
  passport.authenticate("kakao", {
    failureDirect: "/", // 로그인 실패시
  }),
  (req, res) => {
    console.log("카톡!카톡!");
    res.redirect("/");
  }
);

module.exports = router;
