const passport = require("passport");
const local = require("./local");
const kakao = require("./kakaoStrategy");
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
  passport.serializeUser((user, done) => {
    done(null, user.userid);
  });

  passport.deserializeUser((id, done) => {
    users.findOne({
      where: { userid : id },
      // include: [
      //   {
      //     model: User,
      //     attributes: ["id", "nick"],
      //     as: "Followers",
      //   },
      //   {
      //     model: User,
      //     attributes: ["id", "nick"],
      //     as: "Followings",
      //   },
      // ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
