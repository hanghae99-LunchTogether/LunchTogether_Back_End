// 1
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { users } = require("../models");

// 로그인 성공여부 판단
module.exports = () => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        // req.body 값
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
      },
      // 콜백함수
      async (req, email, password, done) => {
        try {
          const user = await users.findOne({
            where: {
              email,
            },
          });
          if (!user) {
            // 검색된 유저 데이터가 없다면 에러
            done(null, false, { reason: "존재하지 않는 사용자 입니다." });
            return;
          }
          // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
          const salt = user.salt;
          let inpw = crypto
            .createHash("sha512")
            .update(password + salt)
            .digest("hex");
          // 해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
          if (inpw === user.password) {
            done(null, user); // -> serializer로 이동
            return;
          }
          // 비밀번호가 다를경우 에러
          done(null, false, { reason: "올바르지 않은 비밀번호 입니다." });
        } catch (error) {
          done(error);
        }
      }
    )
  );
  // passport.use(
  //   new JwtStrategy(
  //     {
  //       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //       secretOrKey: process.env.SECRET_KEY,
  //     },
  //     async function jwtVerify(payload, done) {
  //       try {
  //         const user = await users.findOne({
  //           where: {
  //             id: payload.id,
  //           },
  //         });
  //         if (user) {
  //           done(null, user);
  //           return;
  //         }
  //         done(null, false, { reason: "올바르지 않은 인증정보 입니다" });
  //       } catch (error) {
  //         done(error);
  //       }
  //     }
  //   )
  // );
};
