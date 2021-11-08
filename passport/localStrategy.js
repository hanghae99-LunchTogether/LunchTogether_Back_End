// 1
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { users } = require("../models");

// 로그인 성공여부 판단
module.exports = () => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        // req.body 속성값
        usernameField: "email",
        passwordField: "password",
        // passReqToCallback: true, //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
      },
      // 콜백함수
      async (email, password, done) => {
        // done은 authenticate 콜백
        try {
          const exUser = await users.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
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
