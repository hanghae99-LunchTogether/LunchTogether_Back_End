const { posts, sequelize } = require("../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer"); //form data 처리를 할수 있는 라이브러리 multer
const multerS3 = require("multer-s3"); // aws s3에 파일을 처리 할수 있는 라이브러리 multer-s3
const AWS = require("aws-sdk"); //javascript 용 aws 서비스 사용 라이브러리
const path = require("path"); //경로지정
const { logger } = require("../config/logger"); //로그

getlunchlist = async (req, res) => {
  try {
    const post = await posts.findAll({
      order: [["date", "DESC"]],
    });
    logger.info("GET /lunchpost/");
    return res.status(200).send({
      result: "success",
      msg: "리스트 불러오기 성공",
      posts: post,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "리스트 불러오기 실패",
    });
  }
};


getlunchposet = async (req, res) => {
  const user = res.locals.user;
  const { post } = req.body;
  // const ispost = JSON.parse(post);
  console.log(post);
  const ispost = post;
  try {
    const querys = "insert into posts (userId ,content , date, location) value (:userId,:content,:date,:location);";
    await sequelize.query(querys, {
        replacements: {
          userId: user.userId,
          content: ispost.content,
          date : ispost.date,
          location : ispost.location
        },
        type: sequelize.QueryTypes.INSERT,
    });
    logger.info('POST /lunchPost');
    return res.status(200).send({
      result: "success",
      msg: "게시글 작성 성공",
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "게시글 작성 실패",
    });
  }
};


module.exports = {
  getlunchlist: getlunchlist,
  getlunchposet: getlunchposet,
};
