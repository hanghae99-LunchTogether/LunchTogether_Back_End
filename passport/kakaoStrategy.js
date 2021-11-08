// 1
const passport = require("passport");
const { logger } = require("../config/logger");
const KakaoStrategy = require("passport-kakao").Strategy;
const { users } = require("../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      // profile은 카카오에서 보내는 정보
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile: ", profile);
          const exuser = await users.findOne({
            where: {
              userid: profile.id,
            },
          });
          // 카카오 회원가입 한 사용자 인지
          if (exuser) {
            console.log("이미 로그인중", exuser);
            done(null, exuser);
            // 카카오 회원가입 한 사용자 아니라면 회원가입 진행
          } else {
            console.log("db저장 완료");
            const newuser = await users.create({
              email: profile._json.kakao_account.email,
              nickname: profile.username,
            });
            console.log("newuser: ", newuser);
            done(null, newuser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
