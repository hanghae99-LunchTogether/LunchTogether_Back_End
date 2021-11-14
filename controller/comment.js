const { comments, users, sequelize } = require("../models");
const { logger } = require("../config/logger"); //로그
require("date-utils");

commentget = async (req, res) => {
  const { lunchid } = req.params; // params에 lunchid 객체
  try {
    // comments table의 lunchid 조회
    const comment = await comments.findAll({
      // comments table과 관계된 users table의 nickname 칼럼 검색
      include: [
        {
          model: users,
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
      ],
      where: { lunchid },
    });
    if (!comment) {
      logger.info("GET /comment/:lunchid 불러올 댓글이 없어요");
      return res.status(200).send({
        result: "success",
        msg: "불러올 댓글이 없어요",
      });
    } else {
      logger.info("GET /comment/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "댓글 불러오기 성공",
        comment: comment,
      });
    }
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "댓글 불러오기 실패",
    });
  }
};

//댓글 작성
commentpost = async (req, res) => {
  const { lunchid } = req.params;
  const { comment } = req.body;
  const user = res.locals.user;
  const postDate = new Date();
  const time = postDate.toFormat("YYYY-MM-DD HH24:MI:SS");
  try {
    // comments table의 lunchid 조회
    await comments.create({
      comment: comment,
      lunchid: lunchid,
      userid: user.userid,
      time: time,
    });
    const createdcomment = await comments.findOne({
      where: {
        comment: comment,
        lunchid: lunchid,
        userid: user.userid,
        time: time,
      },
    });
    if (!createdcomment) {
      logger.info("POST /comment/:lunchid 작성한 댓글이 없는것 같네요...?");
      return res.status(200).send({
        result: "success",
        msg: "작성한 댓글이 없는것 같네요...?",
      });
    }
    logger.info("POST /comment/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "댓글 작성 성공",
      comment: createdcomment,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "댓글 작성 실패",
    });
  }
};

//댓글 삭제
commentdele = async (req, res) => {
  const { commentid } = req.params;
  const user = res.locals.user;
  try {
    // comments table의 lunchid 조회
    const query =
      "delete from comments where commentid = :commentid AND userid = :userid;";
    const comment = await sequelize.query(query, {
      replacements: {
        commentid: commentid,
        userid: user.userid,
      },
      type: sequelize.QueryTypes.DELETE,
    });
    logger.info("delete /comment/:commentid");
    return res.status(200).send({
      result: "success",
      msg: "댓글 삭제 성공",
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "댓글 삭제 실패",
    });
  }
};

module.exports = {
  commentget: commentget,
  commentpost: commentpost,
  commentdele: commentdele,
};
