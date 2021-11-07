const { comments, users, sequelize, usersReviews } = require("../models");
const { logger } = require("../config/logger"); //로그


//유저 지수 넣기
spoonpost = async (req, res) => {
  const { targetuserid, spoon , comment, lunchid} = req.body;
  const user = res.locals.user;
  if(user.userid == targetuserid){
    return res.status(400).send({
      result: "fail",
      msg: "본인이 본인을 평가하는건 아닌거같은데요...?",
    });
  }
  console.log("타겟:",targetuserid,"점수:", spoon,"어떤 포스터:" ,lunchid,"코맨트는:" ,comment)
  try {
    let sum;
    const all = await usersReviews.findAll({where: {targetusers : targetuserid}});
    const doc = {userid : user.userid , targetusers : targetuserid,lunchid:lunchid ,spoon: spoon, comment: comment }
    const [isuser, created] = await usersReviews.findOrCreate({
      where: { userid: user.userid, targetusers : targetuserid, lunchid:lunchid },
      default: doc,
    });
    if(!created){
      return res.status(400).send({
        result: "fail",
        msg: "평가를 벌써 하셧네요..",
      });
    }else{
      for(a of all){
        sum += a.spoon;
      }
      users.update({mannerStatus: sum+spoon/all.length+1},{ where:{userid: targetuserid}})
      logger.info("POST /book/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "평가 성공!",
        review: isuser
      });
    }
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
      "select  a.mannerStatus as totalmanner, usersReviews.reviewid , usersReviews.spoon , usersReviews.comments , a.nickname as writeuser, a.image as writeuserimage, a.mannerStatus as writeusermanner, lunchs.* from usersReviews inner join users AS a on usersReviews.userid = a.userid inner join lunchs on lunchs.lunchid = usersReviews.lunchid where usersReviews.targetusers = :userid;";
    const userspoon = await sequelize.query(query, {
        replacements: {
            userid: userid,
          },
      type: sequelize.QueryTypes.SELECT,
    });
    logger.info("GET /spoon");
    return res.status(200).send({
      result: "success",
      msg: "유저 리뷰 요청 완료",
      data: userspoon,
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
