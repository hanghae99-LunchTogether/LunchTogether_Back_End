const { posts, sequelize } = require("../models");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer"); //form data 처리를 할수 있는 라이브러리 multer
const multerS3 = require("multer-s3"); // aws s3에 파일을 처리 할수 있는 라이브러리 multer-s3
const AWS = require("aws-sdk"); //javascript 용 aws 서비스 사용 라이브러리
const path = require("path"); //경로지정
const { logger } = require("../config/logger"); //로그
const { upusers } = require("./user");

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

detaillunchpost = async (req, res) => {
  const { postId } = req.params;
  try {
    const postDetail = await posts.findOne({
      include: [{ model: users, attributes: ["nickName"] }],
      where: { postId: postId },
    });
    logger.info("GET /lunchpost/:postId");
    return res.status(200).send({
      result: "success",
      msg: "점심약속 상세정보 성공",
      posts: postDetail,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "점심약속 상세정보 실패",
    });
  }
};

module.exports = {
  getlunchlist: getlunchlist,
  detaillunchpost: detaillunchpost,
};
