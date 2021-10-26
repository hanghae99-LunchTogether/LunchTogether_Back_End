const { sequelize } = require("../models");
const { logger } = require("../config/logger"); //로그

//점약 신청
applicantpost = async (req, res) => {
  const { lunchid } = req.params; // params에 lunchid 객체
  const user = res.locals.user;
  try {
    const query =
      "insert into applicants set approval = :approval, lunchid = :lunchid, userId = :userId;";
    const applicant = await sequelize.query(query, {
      replacements: {
        approval: false,
        lunchid: lunchid,
        userId: user.userId,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    logger.info("POST /comment/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "신청 작성 성공",
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "신청 작성 실패",
    });
  }
};

//신청 삭제
applicantdelete = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const query =
      "DELETE FROM applicants WHERE lunchid = :lunchid AND userId = :userId;";
    const comment = await sequelize.query(query, {
      replacements: {
        lunchid: lunchid,
        userId: user.userId,
      },
      type: sequelize.QueryTypes.DELETE,
    });
    logger.info("POST /comment/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "신청 삭제 성공",
      test: comment,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "신청 삭제 실패",
    });
  }
};

//해당페이지의 신청자 보여주기
applicantget = async (req, res) => {
  const { lunchid } = req.params;
  try {
    // comments table의 lunchid 조회
    const query =
      "select users.nickname, applicants.* from applicants inner join users on users.userId = applicants.userId where lunchid = :lunchid;";
    const applicant = await sequelize.query(query, {
      replacements: {
        lunchid: lunchid,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    const data = { data: applicant };
    logger.info("POST /comment/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "댓글 보이기 성공",
      data: data,
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
  applicantpost: applicantpost,
  applicantdelete: applicantdelete,
  applicantget: applicantget,
};
