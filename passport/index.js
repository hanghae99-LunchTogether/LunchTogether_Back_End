const kakao = require("./kakaoLogin");
const User = require("../models/users");

module.exports = (passport) => {
  // serializeUser는 로그인 시 실행되며, req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
  passport.serializeUser((user, done) => {
    // Strategy 성공 시 호출됨
    done(null, user.userid); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
  });

  passport.deserializeUser(async (user, done) => {
    // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
    const nowUser = await User.findOne({ userid });
    const nowUserEmailnickname = {
      userid: nowUser.userid,
      nickname: nowUser.nickname,
    };
    done(null, nowUserEmailnickname); // 여기의 user가 req.user가 됨
  });
  kakao(passport);
};
