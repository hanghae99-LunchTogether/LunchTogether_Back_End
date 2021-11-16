const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.create = function (req, res, next) {
  passport.authenticate(
    "local",
    (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.status(400).send({ result: "fail", msg: info.message });
      }
      return req.login(user,{ session: false }, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        const token = jwt.sign(
          {
            id: user["userid"]
          },
          process.env.SECRET_KEY
        );
        const data = { user: user };
        return res.status(200).send({
          result: "success",
          msg: "로그인 완료.",
          token: token,
          data: data,
        });
      });
    }
  )(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};





exports.kakao = function async (req, res){
  try {
    console.log("여기서 테스트 한번 합시다.");
    console.log(req.session);
    const user = req.user;
    const token = jwt.sign({ id: user["userid"] }, process.env.TOKEN_KEY);
    const data = { user: user };
    res.status(200).send({
      message: "로그인에 성공하였습니다.",
      data: data,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
}
