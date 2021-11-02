// 2
const express = require("express");
const { users, sequelize } = require("../models");
const passport = require("passport");
const { info } = require("winston");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { logger } = require("../config/logger");

async function emailCheck(email) {
  try {
    // const { email } = req.body;
    const isemail = await users.findOne({ where: { email: email } });
    if (isemail) {
      console.log("이메일 존재함" + email);
      return true;
    } else {
      console.log("이메일 없음" + email);
      return false;
    }
  } catch (error) {
    console.log(error);
    return true;
  }
}

async function nickNameCheck(nickname) {
  try {
    const isemail = await users.findOne({ where: { nickname: nickname } });
    if (isemail) {
      console.log("닉네임 존재함" + nickname);
      return true;
    } else {
      console.log("닉네임 없음" + nickname);
      return false;
    }
  } catch (error) {
    console.log(error);
    return true;
  }
}

// 회원가입
router.post("/signup", async (req, res) => {
  const { username, nickname, email, password } = req.body;
  try {
    if (await emailCheck(email)) {
      return res
        .status(400)
        .send({ result: "fail", msg: "이메일이 중복되었습니다." });
    } else if (await nickNameCheck(nickname)) {
      return res
        .status(400)
        .send({ result: "fail", msg: "닉네임이 중복되었습니다." });
    } else {
      const salt = Math.round(new Date().valueOf() * Math.random()) + "";
      const hashpw = crypto
        .createHash("sha512")
        .update(password + salt)
        .digest("hex");
      console.log("여기:", username, nickname, email, hashpw);
      const query =
        "insert into users (username, nickname, email, password, salt) values(:username, :nickname, :email, :password, :salt);";
      const users = await sequelize.query(query, {
        replacements: {
          username: username,
          nickname: nickname,
          email: email,
          password: hashpw,
          salt: salt,
        },
        type: sequelize.QueryTypes.INSERT,
      });
      logger.info("POST /signup");
      return res.status(200).send({ result: "success", msg: "회원가입 완료." });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(400)
      .send({ result: "fail", msg: "DB 정보 조회 실패", error: error });
  }
});

// passport local login
router.post("/login", async (req, res, next) => {
  console.log("여기가 마지막이네");
  //passport는 req객체에 login과 logout 메서드 추가
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) {
      res.status(400).send({ result: "fail", msg: info.reason });
      return;
    }
    return req.login(user, (err) => {
      if (err) {
        res.send(err);
        return;
      }
      if (user) {
          const token = jwt.sign(
            {
              id: users["userid"],
              email: users["email"],
              nickname: users["nickname"],
            },
            process.env.SECRET_KEY
          );
          const data = { user: users };
          logger.info("POST /login");
          return res.status(200).send({
            result: "success",
            msg: "로그인 완료.",
            token: token,
            data: data,
          });
      }
    });
  });
  return res.status(400).send({ result: "fail", msg: "DB 정보 조회 실패" });
});

// passport local logout
router.get("/logout", (req, res) => {
  req.logout(); // req.user 삭제
  req.session.destroy(); // req.user in fact, not needed
  res.status(200).send({ result: "success", msg: "로그아웃 성공" });
});

// kakao login Router
router.get("/kakao", passport.authenticate("kakao"));
// 처음에 카카오 로그인 창으로 리다이렉트. 그 창에서 로그인 후 성공 여부를 /kakao/callback으로 받음

router.get(
  "/kakao/callback", // 로그인 성공여부 검사
  passport.authenticate("kakao", {
    failureDirect: "/", // 로그인 실패시
    successRedirect: "/loginComplete", // 로그인 성공시
  }),
  (req, res) => {
    console.log("카톡!카톡!");
    res.redirect("/");
  }
);

module.exports = router;
