const { comments, users, sequelize, usersReviews } = require("../models");
const { logger } = require("../config/logger"); //로그

//유저 지수 넣기
spoonpost = async (req, res) => {
  const { targetUserId, spoon } = req.body;
  const user = res.locals.user;
  try {
    const query =
      "insert into usersReviews set userId = :userId, targetUsers = :targetUsers, stars = :star, comments = :comment;";
    const comment = await sequelize.query(query, {
      replacements: {
        userId: user.userId,
        targetUsers: targetUserId,
        star: spoon,
        comment: "현재는 테스트",
      },
      type: sequelize.QueryTypes.INSERT,
    });
    logger.info("POST /spoon");
    return res.status(400).send({
      result: "success",
      msg: "유저평가 작성 완료",
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "유저평가 작성 실패",
    });
  }
};

//유저 리뷰 보기
spoonget = async (req, res) => {
  const { userid } = req.params;
  try {
    const query =
      "select users.nickName , usersReviews.* from users inner join usersReviews on users.userId = usersReviews.userId where usersReviews.userId = :userId ;";
    const userspoon = await sequelize.query(query, {
        replacements: {
            userId: userid,
          },
      type: sequelize.QueryTypes.SELECT,
    });
    let sum ;
    for (a of userspoon ){
        sum += a.star;
    }
    sum = sum/userspoon.length;
    data = {
        spoon : sum,
        targetuser : userspoon[0].nickName
    }
    logger.info("GET /spoon");
    return res.status(200).send({
      result: "success",
      msg: "유저 리뷰 요청 완료",
      data: data,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "유저 리뷰 요청 실패",
    });
  }
};

module.exports = {
  spoonget: spoonget,
  spoonpost: spoonpost,
};