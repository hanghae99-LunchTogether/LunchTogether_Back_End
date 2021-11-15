const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.create = function (req, res, next) {
  passport.authenticate(
    "local",
    { session: false },
    (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.status(400).send({ result: "fail", msg: info.message });
      }
      return req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        const token = jwt.sign(
          {
            id: user["userid"],
            nickname: user["nickname"],
          },
          process.env.SECRET_KEY
        );
        const data = { user: user };
        return res.status(200).header('Access-Control-Expose-Headers','Set-Cookie').send({
          result: "success",
          msg: "로그인 완료.",
          token: token,
          data: data,
        });
      });
    }
  )(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};
