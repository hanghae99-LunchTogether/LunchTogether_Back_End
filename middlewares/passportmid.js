const jwt = require("jsonwebtoken");
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    console.log(req);
    const token = jwt.sign(
      {
        id: req.user["userid"],
      },
      process.env.SECRET_KEY
    );
    const data = { user: req.user };
    res.status(200).send({ msg: "로그인 되있음요~!", data:data, token:token });
    // res.status(200).send({
    //     result: "success",
    //     msg: "로그인 완료.",
    //     token: token,
    //     data: data,
    //   });
  }
};
