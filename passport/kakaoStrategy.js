const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const axios = require("axios");

const {
  users,
  sequelize,
  locationdata,
  lunchs,
  applicant,
  usersReviews,
  lunchdata,
  bookmarks,
  useroffer,
} = require("../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: process.env.dododomein + "/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const res = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const exUser = await users.findOne({
            where: { kakaoid: profile.id },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await users.create({
              email: res.data.kakao_account.email,
              nickname: res.data.properties.nickname,
              kakaoid: res.data.id
            });
            done(null, newUser);
          }
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
