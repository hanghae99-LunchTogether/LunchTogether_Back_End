const passport = require("passport");
const kakaoPassport = require("passport-kakao");
const { logger } = require("../config/logger");
const KakaoStrategy = kakaoPassport.Strategy;
const User = require("../models/users");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: "bfd5e05cf3d258c0045c064b134a0281",
        callbackURL: "/user/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile", profile);
        const { username } = profile;
        const { email } = profile._json.kakao_account;
        try {
          const user = await User.findOne({ email });
          if (!user) {
            const newUser = await User.create({
              email,
              nickname: username,
              isKaKao: true,
            });
            return done(null, newUser);
          } else {
            return done(null, user);
          }
        } catch (error) {
          logger.error(error);
        }
      }
    )
  );
};
