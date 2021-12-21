const passport = require("passport");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;

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
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const query = "select * from users where email = :email";
          const isuser = await sequelize.query(query, {
            replacements: {
              email: email,
            },
            type: sequelize.QueryTypes.SELECT,
          });
          const users = isuser[0];
          if (users) {
            const salt = users.salt;
            let inpw = crypto.createHash("sha512").update(password + salt).digest("hex");
            if (inpw === users.password) {
              done(null, users);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
