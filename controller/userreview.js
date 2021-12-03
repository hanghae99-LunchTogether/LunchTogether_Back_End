const {
  comments,
  users,
  sequelize,
  usersReviews,
  lunchs,
} = require("../models");
const { logger } = require("../config/logger"); //로그

//유저 지수 넣기
spoonpost = async (req, res) => {
  const reviews = req.body;
  const user = res.locals.user;
  console.log( "리뷰데이터들",reviews[0] );
  try {
    let sum = 0;
    if(reviews.length){
      logger.error("POST /book/:lunchid 리뷰 데이터를 안보냄");
      return res.status(400).send({
        result: "fail",
        msg: "잘못된 요청 리뷰데이터를 보내지 않았습니다.",
      });
    }
    const targetUserId = reviews[0].targetUserId
    const lunchid = reviews[0].lunchid
    const islunch = await lunchs.findOne({ where: { lunchid: lunchid } });
    if (!islunch) {
      return res.status(400).send({
        result: "fail",
        msg: "잘못된 요청 해당 점약이 존재하지 않음.",
      });
    }
    const all = await usersReviews.findAll({
      where: { targetUserId: targetUserId },
    });
    // const doc = {
    //   reviewerId: reviewerId,
    //   targetUserId: targetUserId,
    //   lunchid: lunchid,
    //   spoon: spoon,
    //   comment: comment,
    // };
    function findisuser(element) {
      sum = sum + element.dataValues.spoon;
      return true;
    }
    const isusers = all.filter(findisuser);
    reviews.forEach((target)=>{
      sum = sum + target.spoon;
    })
    const userre = await usersReviews.bulkCreate(reviews);
    const issum = (sum) / (all.length + reviews.length);
    users.update(
      { mannerStatus: issum },
      { where: { userid: targetUserId } }
    );
    logger.info("POST /book/:lunchid");
    return res.status(200).send(userre);
  } catch (err) {
    logger.error(err);
    console.log(err);
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
      "select  a.mannerStatus as totalmanner, usersReviews.reviewerId , usersReviews.spoon , usersReviews.comment , a.nickname as reviewer, a.image as reviewerimage, a.mannerStatus as reviewermanner, lunchs.* from usersReviews inner join users AS a on usersReviews.userid = a.userid inner join lunchs on lunchs.lunchid = usersReviews.lunchid where usersReviews.targetUserId = :userid;";
    const userspoon = await sequelize.query(query, {
      replacements: {
        userid: userid,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    if (!userspoon) {
      logger.info("GET /spoon 아직 작성된 유저 리뷰가 없어요");
      return res.status(200).send({
        result: "success",
        msg: "아직 작성된 유저 리뷰가 없어요",
      });
    }
    logger.info("GET /spoon");
    return res.status(200).send(userspoon);
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
