// 2

const passport = require("passport");
// const local = require("./localLogin"); // 로컬 로그인
const kakao = require("./kakaoStrategy"); // 카카오 로그인
const { users } = require("../models");

// serializeUser는 사용자정보 객체를 세션에 아이디로 저장
// deserializeUser는 세션에 저장한 아이디를 통해 사용자정보 객체를 조회

module.exports = () => {
  // serializeUser는 로그인 시에만 실행
  passport.serializeUser((user, done) => {
    // 여기의 userid가 deserializeUser의 첫 번째 매개변수로 이동
    done(null, user.userid);
  });

  // 이미 로그인 한 유저. 매번 실행
  passport.deserializeUser(async (userid, done) => {
    console.log("디시리얼 실행:", userid);
    const user = await users.findOne({ where: { userid } });
    console.log("user:", user);
    // 매개변수 user는 serializeUser의 done의 인자 userid를 받은 것
    const nowUserEmailnickname = {
      userid: user.userid,
      email: user.email,
      nickname: user.nickname,
    };
    console.log("nowUserEmailnickname: ", nowUserEmailnickname);
    // nowUserEmailnickname가 req.user가 됨
    done(null, nowUserEmailnickname);
  });
  // local();
  kakao();
};
