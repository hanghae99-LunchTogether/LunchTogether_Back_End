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
    console.log(req.user)
    // const message = encodeURIComponent("로그인한 상태입니다.");
    res.status(200).send({msg:"로그인 되있음요~!", user : req.user});
    // res.status(200).send({
    //     result: "success",
    //     msg: "로그인 완료.",
    //     token: token,
    //     data: data,
    //   });
  }
};
