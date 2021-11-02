const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { users, sequelize } = require("../models");

module.exports = () => {
  passport.use(
    new localStrategy(
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
          const exusers = isuser[0];
          if (exusers) {
            const salt = exusers.salt;
            let inpw = crypto
              .createHash("sha512")
              .update(password + salt)
              .digest("hex");
            if (inpw === exusers.password) {
                done(null, exusers);
            }else{
                done(null, false, {message : "비밀번호가 일치하지 않음"})
            }
          } else {
                done(null, false, {message : "비밀번호가 일치하지 않음"})
          }
        } catch (error) {  
            console.log(error);
            done(error)
        }
      }
    )
  );
};
