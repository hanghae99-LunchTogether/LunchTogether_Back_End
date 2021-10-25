const { users, sequelize } = require("../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer"); //form data 처리를 할수 있는 라이브러리 multer
const multerS3 = require("multer-s3"); // aws s3에 파일을 처리 할수 있는 라이브러리 multer-s3
const AWS = require("aws-sdk"); //javascript 용 aws 서비스 사용 라이브러리
const path = require("path"); //경로지정
const fs = require('fs')
require('dotenv').config({path: __dirname + '\\' + '.env'});
const { logger } = require("../config/logger"); //로그

AWS.config.update({
  //보안자격증명 액세스 키 설정해야 s3 bucket 접근이 가능하다.
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: "ap-northeast-2", // 한국
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.bucket,
    key(req, file, cb) {
      cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
    },
    acl: 'public-read-write',
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

async function emailCheck(email){
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
};

async function nickNameCheck(nickName){
  try {
    const isemail = await users.findOne({ where: { nickName: nickName } });
    if (isemail) {
      console.log("닉네임 존재함" + nickName);
      return true;
    } else {
      console.log("닉네임 없음" + nickName);
      return false;
    }
  } catch (error) {
    console.log(error);
    return true;
  }
};

//회원가입
signup = async (req, res) => {
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
      console.log(username,nickname, email, hashpw)
      const query =
        "insert into users (name, nickName, email, pw, salt) values(:name, :nickName, :email, :pw, :salt);";
      const users = await sequelize.query(query, {
        replacements: {
          name: username,
          nickName: nickname,
          email: email,
          pw: hashpw,
          salt: salt,
        },
        type: sequelize.QueryTypes.INSERT,
      });
      logger.info("POST /signup");
      return res.status(200).send({ result: "success", msg: "회원가입 완료." });
    }
  } catch (error) {
    logger.error(error);
    return res.status(400).send({ result: "fail", msg: "DB 정보 조회 실패",  error: error });
  }
};

//로그인
login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = "select * from users where email = :email";
    const isuser = await sequelize.query(query, {
      replacements: {
        email: email,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(isuser)
    const users = isuser[0];
    if (users) {
      const salt = users.salt;
      let inpw = crypto
        .createHash("sha512")
        .update(password + salt)
        .digest("hex");
      if (inpw === users.pw) {
        //,{expiresIn: '2h',} <- 만료시간 아직은 테스트 단계니깐 만료시간을 따로주지는 않음
        const token = jwt.sign(
          { id: users["id"], name: users["email"] },
          process.env.SECRET_KEY
        );
        const data = {user: users}
        logger.info("POST /login");
        return res
          .status(200)
          .send({ result: "success", msg: "로그인 완료.", token: token , data : data});
      }
    } else {
      logger.error(error);
      return res
        .status(400)
        .send({ result: "fail", msg: "이메일이 잘못되었습니다." });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(400)
      .send({ result: "failure", msg: "DB 정보 조회 실패", error: error });
  }
};

//유저정보 요청
getuser = async (req, res) => {
  const user = res.locals.user;
  
  try {
    const query = "select * from users where userId = :userId";
    const users = await sequelize.query(query, {
        replacements: {
          userId: user.userId
        },
        type: sequelize.QueryTypes.SELECT,
    });
    const data  = {user : users}
    logger.info("GET /main");
    return res
      .status(200)
      .send({ result: "success", msg: "유저정보 조회 완료" ,data: data });
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res
      .status(401)
      .send({ result: "fail", msg: "유저정보 조회실패" , error: error});
  }
};


//유저세부정보 수정
upusers = async (req, res) => {
  const userloc = res.locals.user;
  const { user } = req.body;
  const isuser = JSON.parse(user);

  if(req.file){console.log("파일은 담기고있는가?",req.file.location)}
  try {
    const query = "select * from users where email = :email";
    const users = await sequelize.query(query, {
        replacements: {
          email: userloc.email
        },
        type: sequelize.QueryTypes.SELECT,
    });
    let originalUrl;
    let querys = "UPDATE users SET ";
    if(isuser.email)querys = querys + " email = :email,";
    if(isuser.name)querys = querys + " name = :name,";
    if(req.file){
      querys = querys + " image = :image,";
      originalUrl = req.file.location;
    }
    if(isuser.mbti)querys = querys + " mbti = :mbti,";
    if(isuser.gender)querys = querys + " gender = :gender,";
    if(isuser.introduction)querys = querys + " introduction = :introduction,";
    if(isuser.location)querys = querys + " location = :location,";
    if(isuser.menu)querys = querys + " menu = :menu,";
    if(isuser.company)querys = querys + " company = :company,";
    querys = querys.slice(0, -1);
    console.log(querys[querys.length-1])
    querys = querys + " WHERE userId = :userId;";
    console.log("마지막으로 완성된 쿼리문", querys);
    await sequelize.query(querys, {
        replacements: {
          email: isuser.email,
          name: isuser.name,
          image: originalUrl,
          mbti: isuser.mbti,
          gender: isuser.gender,
          introduction :isuser.introduction,
          location: isuser.location,
          menu : isuser.menu,
          company: isuser.company,
          userId : users[0].userId
        },
        type: sequelize.QueryTypes.UPDATE,
    });
    logger.info("patch /myProfile");
    return res
      .status(200)
      .send({ result: "success", msg: "유저정보 수정완료"});
  } catch (error) {
    logger.error(error);
    // console.log(error)
    return res
      .status(401)
      .send({ result: "fail", msg: "유저정보 조회실패" , error: error});
  }
};

module.exports = {
  emailCheck: emailCheck,
  nickNameCheck: nickNameCheck,
  signup: signup,
  login: login,
  getuser:getuser,
  upusers: upusers,
};
