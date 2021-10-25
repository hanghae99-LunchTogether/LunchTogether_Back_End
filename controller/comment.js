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
    logger.info('GET /comment/:postId')
    return res.status(200).send({
      result: "success",
      msg: "댓글 불러오기 성공",
      comment: comment,
    });
  } catch (err) {
    logger.error(err)
    return res.status(400).send({
        result: "fail",
        msg: "댓글 불러오기 실패",
      });
  }
};

module.exports = {
    commentget: commentget
  };
