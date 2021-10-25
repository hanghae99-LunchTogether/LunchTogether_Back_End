const express = require("express");
const router = express.Router();
const { comments, users } = require("../models");
const controller = require("../controller/comment");

router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params; // params에 postId 객체
  try {
    // comments table의 postId 조회
    const comment = await comments.findAll({
      // comments table과 관계된 users table의 nickname 칼럼 검색
      include: [{ model: users, attributes: ["nickname"] }],
      where: { postId },
    });
    res.status(200).send({
      result: "success",
      msg: "댓글 불러오기 성공",
      comment: comment,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
