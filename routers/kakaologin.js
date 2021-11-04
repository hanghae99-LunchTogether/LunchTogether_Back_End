const express = require("express");
const User = require("../models/users.js");
const kakaoLoginRouter = express.Router();
const passport = require("passport");
const kakaoPassport = require("passport-kakao");
const KakaoStrategy = kakaoPassport.Strategy;

passport.serializeUser((user, done) => {
  // Strategy 성공 시 호출됨
  const { _id, nick } = user;
  console.log("ser");
  done(null, { _id, nick }); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser(async (user, done) => {
  // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  const { _id, nick } = user;
  const nowUser = await User.findById({ _id });
  console.log("dese");
  const nowUserEmailNick = {
    _id: nowUser._id,
    nick: nowUser.nick,
  };
  done(null, nowUserEmailNick); // 여기의 user가 req.user가 됨
});

//controller
passport.use(
  "kakao",
  new KakaoStrategy(
    {
      clientID: "a9633c12ea6fc881fd0718b35f6747c1",
      clientSecret: "4xHAfd1piTdIGKgL5ptG4osQDVGP8DLr",
      callbackURL: "http://127.0.0.1:3000/kakao/auth/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile, accessToken, refreshToken);
      const { username } = profile;
      const { email } = profile._json.kakao_account;

      try {
        const user = await User.findOne({ email });

        if (!user) {
          const newUser = await User.create({
            email,
            nick: username,
            isKaKao: true,
          });
          return done(null, newUser);
        } else {
          return done(null, user);
        }
      } catch (error) {
        // logger.error(error);
      }
    }
  )
);

//router
kakaoLoginRouter.get("/auth", passport.authenticate("kakao"));
kakaoLoginRouter.get(
  "/auth/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/", // 로그인에 실패했을 경우 해당 라우터로 이동한다
  }),
  (req, res) => {
    // 로그인에 성공했을 경우, 다음 라우터가 실행된다

    res.redirect("/");
  }
);

module.exports = kakaoLoginRouter;
