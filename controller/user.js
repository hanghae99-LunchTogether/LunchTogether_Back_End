const { users, sequelize } = require('../models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer'); //form data 처리를 할수 있는 라이브러리 multer
const multerS3 = require('multer-s3'); // aws s3에 파일을 처리 할수 있는 라이브러리 multer-s3
const AWS = require('aws-sdk'); //javascript 용 aws 서비스 사용 라이브러리
const path = require('path'); //경로지정
const { logger } = require('../config/logger'); //로그

AWS.config.update({
  //보안자격증명 액세스 키 설정해야 s3 bucket 접근이 가능하다.
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'ap-northeast-2', // 한국
});

emailCheck = async (req, res) => {
    try {
        const { email } = req.body;
        const isemail = await users.findOne({ where: { email : email } });
        if(isemail){
            console.log("이메일 존재함" + email);
            return true;
        }
        else{
            console.log("이메일 없음" + email);
            return false;
        }
    } catch (error) {
        console.log(error);
        return true;
    }
}

nickNameCheck = async (req, res) => {
    try {
        const { nickName } = req.body;
        const isemail = await users.findOne({ where: { nickName : nickName } });
        if(isemail){
            console.log("닉네임 존재함" + nickName);
            return true;
        }
        else{
            console.log("닉네임 없음" + nickName);
            return false;
        }
    } catch (error) {
        console.log(error);
        return true;
    }
}



//회원가입
signup = async (req, res) => {
  const { name, nickName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res
      .status(400)
      .send({ result: "fail", msg: "비밀번호가 일치하지 않습니다." });

  try {
      if(await emailCheck){
        return res
        .status(400)
        .send({ result: "fail", msg: "이메일이 중복되었습니다." });
      }
      else if(await nickNameCheck){
        return res
        .status(400)
        .send({ result: "fail", msg: "닉네임이 중복되었습니다." });
      }
      else{
        const salt = Math.round((new Date().valueOf() * Math.random())) + "";
        const hashpw = crypto.createHash("sha512").update(password + salt).digest("hex");
        const query =
        'insert into users (name, nickName, email, pw, salt) values(:name, :nickName, :email, :hashpw, :salt);';
        const users = await sequelize.query(query, {
            replacements: {
                name: name,
                nickName: nickName,
                email: email,
                pw : hashpw,
                salt : salt
            },
            type: sequelize.QueryTypes.INSERT,
        });
        logger.info('POST /sinup');
        return res
        .status(200)
        .send({ result: "success", msg: "회원가입 완료." });
      }
  } catch (error) {
    logger.error(error);
    return res
      .status(400)
      .send({ result: "fail", msg: "DB 정보 조회 실패" });
  }
};


//로그인
login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const query =
        'select * from users where email = :email';
        const users = await sequelize.query(query, {
            replacements: {
                email: email,
                pw : password,
            },
            type: sequelize.QueryTypes.INSERT,
        });
        if(users){
            const salt = users.salt;
            let inpw = crypto.createHash("sha512").update(password + salt).digest("hex");
            if(inpw === users.pw){//,{expiresIn: '2h',} <- 만료시간 아직은 테스트 단계니깐 만료시간을 따로주지는 않음
                const token = jwt.sign({ id: users["id"] , name: users["email"]}, process.env.SECRET_KEY);
                logger.info("POST /login");
                return res
                .status(200)
                .send({ result: "success", msg: "로그인 완료.", token : token });
            }
        }
        else {
            logger.error(error);
            return res
            .status(400)
            .send({ result: "fail", msg: "이메일이 잘못되었습니다." });
        }
        
    } catch (error) {
      logger.error(error);
      return res
        .status(400)
        .send({ result: "failure", msg: "DB 정보 조회 실패" });
    }
  };

module.exports = { emailCheck: emailCheck ,nickNameCheck: nickNameCheck ,signup: signup , login: login };