const { comments, users, sequelize, usersReviews } = require("../models");
const { logger } = require("../config/logger"); //로그

//유저 지수 넣기
spoonpost = async (req, res) => {
  const { targetuserid, spoon , comment} = req.body;
  const user = res.locals.user;
  console.log(targetuserid, spoon , comment)
  try {
    const query =
      "insert into usersReviews set userid = :userid, targetusers = :targetusers, spoon = :spoon, comments = :comment;";
    const comments = await sequelize.query(query, {
      replacements: {
        userid: user.userid,
        targetusers: targetuserid,
        spoon: spoon,
        comment: comment,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    logger.info("POST /spoon");
    return res.status(200).send({
      result: "success",
      msg: "유저평가 작성 완료",
    });
  } catch (err) {
    logger.error(err);
    console.log(err)
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
      "SELECT spoon, comments,(SELECT nickname FROM users WHERE userid = usersReviews.userid ) AS writeuser, (SELECT nickname FROM users WHERE users.userid = usersReviews.targetusers) AS targetuser FROM usersReviews WHERE targetusers = :userid;";
    const userspoon = await sequelize.query(query, {
        replacements: {
            userid: userid,
          },
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(userspoon);
    let sum = 0;
    for (a of userspoon ){
        sum = sum + a.spoon;
    }
    sum = sum/userspoon.length;
    data = {
      comments : userspoon,  
      spoon : sum,
      targetuser : userspoon[0].targetuser
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
