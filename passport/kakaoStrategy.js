const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const {
    users,
    sequelize,
    locationdata,
    lunchs,
    applicant,
    usersReviews,
    lunchdata,
    bookmarks,
    useroffer
  } = require("../models");

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      const exUser = await users.findOne({
        where: { userid: profile.id, username: '카카오유저' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await users.create({
          email: profile._json && profile._json.kakao_account_email,
          nickname: profile.displayName,
          userid: profile.id,
          username: '카카오유저',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};