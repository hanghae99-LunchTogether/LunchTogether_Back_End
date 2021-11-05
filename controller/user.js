const { users, sequelize, locationdata } = require("../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer"); //form data 처리를 할수 있는 라이브러리 multer
const multerS3 = require("multer-s3"); // aws s3에 파일을 처리 할수 있는 라이브러리 multer-s3
const AWS = require("aws-sdk"); //javascript 용 aws 서비스 사용 라이브러리
const path = require("path"); //경로지정
const fs = require("fs");
require("dotenv").config({ path: __dirname + "\\" + ".env" });
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
    acl: "public-read-write",
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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

checkemail = async (req, res)=>{
  const {email} = req.body;
  if (await emailCheck(email)) {
    return res
      .status(200)
      .send({ result: "fail", msg: "이메일이 중복되었습니다." , data: false});
  }
  else{
    return res
      .status(200)
      .send({ result: "fail", msg: "이메일이 중복없음" , data: true });
  }
}

checknickname = async (req, res)=>{
  const {nickname} = req.body;
  if (await nickNameCheck(nickname)) {
    return res
      .status(200)
      .send({ result: "fail", msg: "닉네임이 중복되었습니다." , data: false});
  }
  else{
    return res
      .status(200)
      .send({ result: "fail", msg: "닉네임이 중복없음" , data: true });
  }
}



//회원가입
signup = async (req, res) => {
  const { nickname, email, password } = req.body;
  console.log(nickname, email, password);
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
      console.log(username, nickname, email, hashpw);
      const query =
        "insert into users (username, nickname, email, password, salt, createdAt) values(:username, :nickname, :email, :password, :salt, now());";
      const users = await sequelize.query(query, {
        replacements: {
          username: "로컬유저",
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
};

//로그인  which ==1 로컬 which == 2 카카오 로그인!
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
    const users = isuser[0];
    if (users) {
      const salt = users.salt;
      let inpw = crypto
        .createHash("sha512")
        .update(password + salt)
        .digest("hex");
      if (inpw === users.password) {
        //,{expiresIn: '2h',} <- 만료시간 아직은 테스트 단계니깐 만료시간을 따로주지는 않음
        const token = jwt.sign(
          {
            id: users["userid"],
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
    } else {
      logger.error("해당 유저 이메일 잘못됨");
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

loginkakao = async (req, res) => {
  const { image, nickname, id } = req.body;
  try {
    console.log(image, nickname, id);
    const query =
      "insert into users (userid,username,email,password,nickname,salt,image) select :userid,:username,:email,:password,:nickname,:salt,:image From dual WHERE NOT exists(select * from users where userid = :userid);";
    const isuser = sequelize.query(query, {
      replacements: {
        userid: id,
        username: "카카오 유저",
        email: "카카오 이메일",
        password: "카카오 로그인 유저",
        nickname: nickname,
        salt: "카카오 유저",
        image: image,
        userid: id,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    const users = {
      id: id,
      nickname: nickname,
    };
    const token = jwt.sign(users, process.env.SECRET_KEY);

    logger.info("POST /login");
    return res.status(200).send({
      result: "success",
      msg: "로그인 완료.",
      token: token,
      users: users,
    });
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res.status(400).send({
      result: "failure",
      msg: "DB 정보 조회 실패",
      error: error,
    });
  }
};

//유저정보 요청
getuser = async (req, res) => {
  const user = res.locals.user;
  try {
    const query = "select * from users where userid = :userid";
    const users = await sequelize.query(query, {
      replacements: {
        userid: user.userid,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    const data = { user: users };
    logger.info("GET /main");
    return res
      .status(200)
      .send({ result: "success", msg: "유저정보 조회 완료", data: data });
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res
      .status(401)
      .send({ result: "fail", msg: "유저정보 조회실패", error: error });
  }
};

//유저세부정보 수정
upusers = async (req, res) => {
  const userloc = res.locals.user;
  const {
    username,
    password,
    email,
    nickname,
    menu,
    mbti,
    gender,
    location,
    company,
    introduction,
  } = req.body.profile;
  console.log(
    username,
    email,
    nickname,
    menu,
    mbti,
    gender,
    company,
    introduction
  );
  if (req.file) {
    console.log("파일은 담기고있는가?", req.file.location);
  }
  try {
    let originalUrl;
    let querys = "UPDATE users SET ";
    if (username) querys = querys + " username = :username,";
    if (nickname) querys = querys + " nickname = :nickname,";
    if (email) querys = querys + " email = :email,";
    if (req.file) {
      querys = querys + " image = :image,";
      originalUrl = req.file.location;
    }
    if (mbti) querys = querys + " mbti = :mbti,";
    if (gender) querys = querys + " gender = :gender,";
    if (introduction) querys = querys + " introduction = :introduction,";
    if (location) {
      console.log(location);
      const query =
        "insert into locationdata (id,address_name,road_address_name,category_group_name,place_name,place_url,phone,x,y) select :id,:address_name,:road_address_name,:category_group_name,:place_name,:place_url,:phone,:x,:y From dual WHERE NOT exists(select * from locationdata where id = :id);";
      const locationdb = await sequelize.query(query, {
        replacements: {
          id: location.id,
          address_name: location.address_name,
          road_address_name: location.road_address_name,
          category_group_name: location.category_group_name,
          place_name: location.place_name,
          place_url: location.place_url,
          phone: location.phone,
          x: location.x,
          y: location.y,
          id: location.id,
        },
        type: sequelize.QueryTypes.INSERT,
      });
      querys = querys + " location = :location,";
    }
    if (menu) querys = querys + " menu = :menu,";
    if (company) querys = querys + " company = :company,";
    querys = querys.slice(0, -1);
    querys = querys + " WHERE userid = :userid;";
    console.log("마지막으로 완성된 쿼리문", querys);
    const updateuser = await sequelize.query(querys, {
      replacements: {
        username: username,
        nickname: nickname,
        email: email,
        image: originalUrl,
        mbti: mbti,
        gender: gender,
        introduction: introduction,
        location: location.id,
        menu: menu,
        company: company,
        userid: userloc.userid,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    const users = await users.findOne({
      include: [{ model: locationdata }],
      where: { userid: userloc.userid },
    });

    data = { user: users };
    logger.info("patch /myProfile");
    return res
      .status(200)
      .send({ result: "success", msg: "유저정보 수정완료", data: data });
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res
      .status(401)
      .send({ result: "fail", msg: "유저정보 조회실패", error: error });
  }
};

//다른 유저 정보 조회
getotheruser = async (req, res) => {
  const { userid } = req.params;
  try {
    const user = await users.findOne({
      include: [{ model: locationdata }],
      where: { userid: userid },
    });
    const data = { user: user };
    if (data.user === null) {
      logger.info("GET /myProfile/:userid 유저정보 없음");
      console.log("유저 없음");
      return res
        .status(400)
        .send({ result: "fail", msg: "유저정보 조회 실패" });
    }
    logger.info("GET /myProfile/:userid");
    return res
      .status(200)
      .send({ result: "success", msg: "유저정보 조회 완료", data: data });
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res
      .status(401)
      .send({ result: "fail", msg: "유저정보 조회실패", error: error });
  }
};

module.exports = {
  checkemail: checkemail,
  checknickname: checknickname,
  signup: signup,
  login: login,
  getuser: getuser,
  upusers: upusers,
  getotheruser: getotheruser,
  loginkakao: loginkakao,
};
