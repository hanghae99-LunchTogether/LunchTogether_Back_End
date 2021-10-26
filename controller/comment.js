const { comments, users } = require("../models");
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

commentpost = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const user = res.locals.user;
  try {
    // cooments table에 content,post,user 칼럼 생성
    await comments.create({
      comment,
      postId,
      userId: user.userId,
    });
    // 댓글등록 시, comments table의 조건 조회
    const createdcomment = await comments.findOne({
      where: { comment, postId, userId },
    });
    console.log(createdcomment);
    logger.info("POST /comment/:postId");
    // 등록한 댓글의 postId 선택
    const comment = createdcomment.postId;
    return res.status(200).send({
      result: "success",
      msg: "댓글 등록 성공",
      comment: comment,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "댓글 등록 실패",
    });
  }
};

module.exports = {
  commentget: commentget,
  commentpost: commentpost,
};
