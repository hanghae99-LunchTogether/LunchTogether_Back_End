// passport는 req.isAuthenticated 객체를 추가함
// 로그인 여부 미들웨어

// 로그인해야 볼 수 있는 곳에 사용
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

// 비로그인 미들웨어
// 비로그인 사용자 -> 회원가입창으로
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다");
    res.redirect(`/?error=${message}`);
  }
};
