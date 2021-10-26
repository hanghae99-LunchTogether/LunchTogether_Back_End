const { comments, users, sequelize } = require("../models");
const { logger } = require("../config/logger"); //로그

commentget = async (req, res) => {
  const { postId } = req.params; // params에 postId 객체
  try {
    // comments table의 postId 조회
    const comment = await comments.findAll({
      // comments table과 관계된 users table의 nickname 칼럼 검색
      include: [{ model: users, attributes: ["nickname"] }],
      where: { postId },
    });
    logger.info("GET /comment/:postId");
    return res.status(200).send({
      result: "success",
      msg: "댓글 불러오기 성공",
      comment: comment,
    });
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
  const { postId } = req.params;
  const { comment } = req.body;
  const user = res.locals.user;
  try {
    // comments table의 postId 조회
    const query =
      "insert into comments set comment = :comment, postId = :postId, userId = :userId;";
    const comment = await sequelize.query(query, {
      replacements: {
        comment: comment,
        postId: postId,
        userId: user.userId,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    logger.info("POST /comment/:postId");
    return res.status(200).send({
      result: "success",
      msg: "댓글 작성 성공",
      test: comment,
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
    // comments table의 postId 조회
    const query =
      "delete from comments where commentId = :commentId AND userId = :userId;";
    const comment = await sequelize.query(query, {
      replacements: {
        comment: commentid,
        userId: user.userId,
      },
      type: sequelize.QueryTypes.DELETE,
    });
    logger.info("POST /comment/:postId");
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
