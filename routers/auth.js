// 3

const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

router.get("/", async function (req, res) {
  console.log("실패하면 여기로 오겠지");
  res.send({ success: true });
});

router.get("/loginComplete", async function (req, res) {
  console.log("req:", req);
  res.send({ success: true, userInfo: req.user });
});

// passport local 로그아웃
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
    res.redirect("/loginComplete"); // 로그인 성공시
  }
);

module.exports = router;
