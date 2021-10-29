const passport = require("passport");
const kakaoPassport = require("passport-kakao");
const { logger } = require("../config/logger");
const KakaoStrategy = kakaoPassport.Strategy;
const { users } = require("../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: "6221e6afb1875fe8195b623547804d78",
        clientSecret: "aGmlHNll42BcVbIAVSmYnBXfoQayddrC",
        callbackURL: "/user/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const { username } = profile;
        const { email } = profile._json.kakao_account;
        console.log(username, email);
        try {
          const user = await users.findOne({ where: { email } });
          if (!user) {
            const newUser = await users.create({
              email: email,
              nickname: username,
              provider: "kakao",
            });
            const createduser = await users.findOne({ where: { email } });
            return done(null, createduser.dataValues);
          } else {
            console.log(user);
            return done(null, user.dataValues);
          }
        } catch (error) {
          logger.error(error);
        }
      }
    )
  );
};
