const { posts, sequelize, users } = require("../models");
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

detaillunchpost = async (req, res) => {
  const { postid } = req.params;
  try {
    const postDetail = await posts.findOne({
      include: [{ model: users, attributes: ["nickName"] }],
      where: { postId: postid },
    });
    const data = { post: postDetail}
    logger.info("GET /lunchpost/:postId");
    return res.status(200).send({
      result: "success",
      msg: "점심약속 상세정보 성공",
      data: data,
    });
  } catch (err) {
    console.log(err)
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
