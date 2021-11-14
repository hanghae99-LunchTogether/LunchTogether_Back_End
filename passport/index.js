const passport = require('passport');
const local = require('./local');
const kakao = require('./kakaoStrategy');
const {users} = require("../models")


module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.userid);
  });

  passport.deserializeUser((id, done) => {
    users.findOne({ where: { userid: id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
  kakao();
};