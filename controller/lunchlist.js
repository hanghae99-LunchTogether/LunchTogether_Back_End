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
    const data = { post: postDetail };
    logger.info("GET /lunchpost/:postId");
    return res.status(200).send({
      result: "success",
      msg: "점심약속 상세정보 성공",
      data: data,
    });
  } catch (err) {
    console.log(err);
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "점심약속 상세정보 실패",
    });
  }
};

postlunchlist = async (req, res) => {
  const user = res.locals.user;
  const { title, content, date, location, time, membernum } = req.body;
  // const ispost = JSON.parse(post);
  console.log(post);
  try {
    const querys =
      "insert into posts (userId ,content , date, location) value (:userId,:content,:date,:location);";
    await sequelize.query(querys, {
      replacements: {
        userId: user.userId,
        title: title,
        content: content,
        date: date,
        location: location,
        time: time,
        membernum: membernum,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    logger.info("POST /lunchPost");
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

updatelunchlist = async (req, res) => {
  const { postid } = req.params;
  const { title, content, date, location, time, membernum } = req.body;
  // const ispost = JSON.parse(post);

  try {
    let querys = "UPDATE lunchs SET";
    if (title) querys = querys + " title = :title,";
    if (content) querys = querys + " content = :content,";
    if (date) querys = querys + " date = :date,";
    if (location) querys = querys + " location = :location,";
    if (time) querys = querys + " time = :time,";
    if (membernum) querys = querys + " membernum = :membernum,";

    querys = querys.slice(0, -1);

    querys = querys + " WHERE postid = :postid;";
    await sequelize.query(querys, {
      replacements: {
        postid: postid,
        title: title,
        content: content,
        date: date,
        location: location,
        time: time,
        membernum: membernum,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    logger.info("PATCH/lunchPost");
    return res.status(200).send({
      result: "success",
      msg: "약속 수정 성공",
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "약속 수정 실패",
    });
  }
};

module.exports = {
  getlunchlist: getlunchlist,
  detaillunchpost: detaillunchpost,
  postlunchlist: postlunchlist,
  updatelunchlist: updatelunchlist,
};
