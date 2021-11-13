const {
  users,
  sequelize,
  locationdata,
  lunchs,
  applicant,
  usersReviews,
  lunchdata,
  bookmarks,
  useroffer
} = require("../models");
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

checkemail = async (req, res) => {
  const { email } = req.body;
  if (await emailCheck(email)) {
    return res
      .status(200)
      .send({ result: "fail", msg: "이메일이 중복되었습니다.", data: false });
  } else {
    return res
      .status(200)
      .send({ result: "fail", msg: "이메일이 중복없음", data: true });
  }
};

checknickname = async (req, res) => {
  const { nickname } = req.body;
  if (await nickNameCheck(nickname)) {
    return res
      .status(200)
      .send({ result: "fail", msg: "닉네임이 중복되었습니다.", data: false });
  } else {
    return res
      .status(200)
      .send({ result: "fail", msg: "닉네임이 중복없음", data: true });
  }
};

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
      console.log(nickname, email, hashpw);
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

login = async (req, res) => {
  const { email, password } = req.body;
  if(!email){
    logger.error("해당 유저 이메일 잘못됨");
      return res
        .status(400)
        .send({ result: "fail", msg: "이메일이 잘못되었습니다." });
  }
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
      } else {
        logger.error("POST /login 해당 유저 비밀번호 잘못됨");
        return res
          .status(400)
          .send({ result: "fail", msg: "비밀번호가 잘못되었습니다." });
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
      "insert into users (userid,username,email,password,nickname,salt,image, createdAt) select :userid,:username,:email,:password,:nickname,:salt,:image,now() From dual WHERE NOT exists(select * from users where userid = :userid);";
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
    const query =
      "select userid,email,nickname,image,mbti,introduction,likemenu,dislikemenu,company,mannerStatus,snsurl,job,createdAt,updatedAt from users where userid = :userid";
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
  console.log(req.body);
  const {
    username,
    email,
    nickname,
    likemenu,
    dislikemenu,
    mbti,
    gender,
    locations,
    company,
    introduction,
    job,
    snsurl,
  } = req.body.profile;
  console.log(
    username,
    email,
    nickname,
    likemenu,
    dislikemenu,
    mbti,
    gender,
    company,
    introduction,
    job,
    snsurl
  );
  // console.log(Boolean(username&&email&&nickname&&likemenu&&dislikemenu&&mbti&&gender&&company&&introduction&&jop&&snsurl))
  // if(!Boolean(username&&email&&nickname&&likemenu&&dislikemenu&&mbti&&gender&&company&&introduction&&jop&&snsurl)){
  //     logger.error("patch /myProfile 유저 정보 아무것도 없음");
  //     return res
  //     .status(401)
  //     .send({ result: "fail", msg: "하나라도 변경할 유저정보를 주세요" });
  //   }
  let locationid;
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
    if (locations) {
      console.log(locations);
      const query =
        "insert into locationdata (id,address_name,road_address_name,category_group_name,place_name,place_url,phone,x,y) select :id,:address_name,:road_address_name,:category_group_name,:place_name,:place_url,:phone,:x,:y From dual WHERE NOT exists(select * from locationdata where id = :id);";
      const locationdb = await sequelize.query(query, {
        replacements: {
          id: locations.id,
          address_name: locations.address_name,
          road_address_name: locations.road_address_name,
          category_group_name: locations.category_group_name,
          place_name: locations.place_name,
          place_url: locations.place_url,
          phone: locations.phone,
          x: locations.x,
          y: locations.y,
          id: locations.id,
        },
        type: sequelize.QueryTypes.INSERT,
      });
      locationid = locations.id;
      querys = querys + " location = :location,";
    }
    if (likemenu) querys = querys + " likemenu = :likemenu,";
    if (dislikemenu) querys = querys + " dislikemenu = :dislikemenu,";
    if (company) querys = querys + " company = :company,";
    if (job) querys = querys + " job = :job,";
    if (snsurl) querys = querys + " snsurl = :snsurl,";
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
        location: locationid,
        likemenu: likemenu,
        dislikemenu: dislikemenu,
        company: company,
        job: job,
        snsurl: snsurl,
        userid: userloc.userid,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    const user = await users.findOne({
      attributes: { exclude: ["location", "password", "salt", "gender"] },
      include: [{ model: locationdata, as: "locations" }],
      where: { userid: userloc.userid },
    });

    data = { user: user };
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
      attributes: { exclude: ["location", "password", "salt", "gender"] },
      include: [{ model: locationdata, as: "locations" }],
      where: { userid: userid },
    });
    const owned = await lunchs.findAll({
      attributes: { exclude: ["location", "userid"] },
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },
      ],
      where: { userid: userid },
    });
    const applied =await lunchs.findAll({
      where: [
        {'$applicants.userid$': userid },
      ],
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },]
    });
    const usersReview = await usersReviews.findAll({
      include: [
        { model: users, as: "rater", attributes: { exclude: ["location", "password", "salt", "gender"]},},
        { model: users, as: "target", attributes: { exclude: ["location", "password", "salt", "gender"]},},
        { model: lunchs }
      ],
      where: { targetusers: userid },
    })
    const book =await lunchs.findAll({
      where: [
        {'$bookmarks.userid$': userid },
      ],
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },
        {
        model: bookmarks
      }]
    });
    const offered =await lunchs.findAll({
      where: [
        {'$useroffers.userid$': userid },
      ],
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },
        {
        model: useroffer,
      }]
    });
    
    const lunch = {
      owned: owned,
      applied: applied,
      bookmarked: book,
      offered:offered
    };
    user.dataValues.lunchs = lunch;
    user.dataValues.usersReviews = usersReview;
    const data = { user: user };
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
//유저 세부정보 요청
getdeuser = async (req, res) => {
  const userloc = res.locals.user;
  try {
    const user = await users.findOne({
      attributes: { exclude: ["location", "password", "salt", "gender"] },
      include: [{ model: locationdata, as: "locations" }],
      where: { userid: userloc.userid },
    });
    const owned = await lunchs.findAll({
      attributes: { exclude: ["location", "userid"] },
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },
      ],
      where: { userid: userloc.userid },
    });
    const applied =await lunchs.findAll({
      where: [
        {'$applicants.userid$': userloc.userid },
      ],
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },]
    });


    const usersReview = await usersReviews.findAll({
      include: [
        { model: users, as: "rater", attributes: { exclude: ["location", "password", "salt", "gender"]},},
        {
          model: lunchs,include: [
            {
              model: users,
              as: "host",
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
            { model: lunchdata, as: "locations" },
            {
              model: applicant,
              include: [
                {
                  model: users,
                  attributes: {
                    exclude: ["location", "password", "salt", "gender"],
                  },
                },
              ],
            },
          ],
        }
      ],
      where: { targetusers: userloc.userid },
    })
    const book =await lunchs.findAll({
      where: [
        {'$bookmarks.userid$': userloc.userid },
      ],
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },
        {
        model: bookmarks
      }]
    });
    const offered =await lunchs.findAll({
      where: [
        {'$useroffers.userid$': userloc.userid },
      ],
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },
        {
        model: useroffer,
      }]
    });

    const lunch = {
      owned: owned,
      applied: applied,
      bookmarked: book,
      offered: offered,
    };
    user.dataValues.lunchs = lunch;
    user.dataValues.usersReviews = usersReview;
    const data = { user: user };
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

testusers = async (req, res) => {
  try {
    let pageNum = req.query.page; // 요청 페이지 넘버
    console.log(pageNum);
    let offset = 0;
    if(pageNum > 1){
      offset = 12 * (pageNum - 1);
    }
    const user = await users.findAll({
      attributes: { exclude: ["location", "password", "salt", "gender"] },
      include: [{ model: locationdata, as: "locations" }],
      offset: offset,
      limit: 12
    });
    logger.info("GET /usertest");
    return res
      .status(200)
      .send({ result: "success", msg: "유저정보 조회 완료", user: user });
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res
      .status(401)
      .send({ result: "fail", msg: "알수없는 오류", error: error });
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
  getdeuser: getdeuser,
  testusers: testusers,
};
