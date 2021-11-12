const { sequelize, applicant, users, lunchs, lunchdata } = require("../models");
const Op = sequelize.Op;
const { logger } = require("../config/logger"); //로그

//점약 신청
applicantpost = async (req, res) => {
  const { lunchid } = req.params; // params에 lunchid 객체
  const user = res.locals.user;
  try {
    const lunch = await lunchs.findByPk(lunchid);
    if (!lunch) {
      return res.status(400).send({
        result: "fail",
        msg: "해당 점심 약속이 없습니다",
      });
    }
    const applicants = await applicant.findOne({
      where: { userid: user.userid, lunchid: lunchid },
    });
    if (!applicants) {
      if (user.userid === lunch.dataValues.userid) {
        return res.status(400).send({
          result: "fail",
          msg: "해당 점심 약속의 오너는 신청할 수 없습니다",
        });
      }
      await applicant.create({
        userid: user.userid,
        lunchid: lunchid
      });
      const isapplicant = await applicant.findOne({
        include: [{ model: lunchs }],
        where: { userid: user.userid, lunchid: lunchid },
      });

      logger.info("POST /applicant/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "신청 성공",
        applicants: isapplicant,
      });
    } else {
      return res.status(400).send({
        result: "fail",
        msg: "이미 신청 되어있는 점심 약속입니다.",
      });
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res.status(400).send({
      result: "fail",
      msg: "신청 작성 실패",
    });
  }
};

//본인 신청 취소
applicantdelete = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const query =
      "DELETE FROM applicants WHERE lunchid = :lunchid AND userid = :userid;";
    const comment = await sequelize.query(query, {
      replacements: {
        lunchid: lunchid,
        userid: user.userid,
      },
      type: sequelize.QueryTypes.DELETE,
    });
    logger.info("POST /applicant/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "신청 취소 성공",
      test: comment,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "신청 취소 실패",
    });
  }
};

//해당약속의 신청자 보여주기
applicantget = async (req, res) => {
  const { lunchid } = req.params;
  try {
    // comments table의 lunchid 조회
    const applicants = await applicant.findAll({
      include: [
        {
          model: users,
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: lunchs,
          include: [
            { model: lunchdata, as: "locations" },
            {
              model: users,
              as: "host",
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
        },
      ],
      where: { lunchid: lunchid },
    });
    if (!applicants.length) {
      logger.error("GET /applicant/:lunchid 신청자가 없거나 해당글이 없어요!");
      return res.status(400).send({
        result: "fail",
        msg: "신청자 조회 실패? 신청자가 없는...? 또는 해당글이 없는...?",
      });
    }
    logger.info("GET /applicant/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "신청자 조회 성공",
      applicant: applicants,
    });
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res.status(400).send({
      result: "fail",
      msg: "신청자 조회 실패",
    });
  }
};

//신청 승인여부
applicantconfirmed = async (req, res) => {
  const { userid, confirmed } = req.body;
  const comment = "거절상태 입니다..."
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const applicants = await applicant.findOne({
      include: [
        {
          model: users,
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: lunchs,
          include: [
            { model: lunchdata, as: "locations" },
            {
              model: users,
              as: "host",
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
        },
      ],
      where: { lunchid: lunchid, userid: userid },
    });

    if (!applicants) {
      logger.error("해당 글이 존재하지 않습니다. 또는 해당 신청자가 없습니다.");
      return res.status(400).send({
        result: "fail",
        msg: "신청자 변경 실패 해당약속이 존재 하지 않습니다. 또는 해당 신청자가 없습니다.",
      });
    } else if (applicants.dataValues.lunch.dataValues.userid !== user.userid) {
      logger.error("해당 글의 오너가 아님");
      return res.status(400).send({
        result: "fail",
        msg: "신청자 변경 실패 해당약속의 오너가 아님",
      });
    }
    if (confirmed) {
      applicants.update({ confirmed: true });
      logger.info("patch /applicant/approved/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "신청자 승인 성공",
        applicant: applicants,
      });
    } else {
      if (!comment) {
        logger.error("patch /applicant/approved/:lunchid 거절사유 없음");
        return res.status(400).send({
          result: "fail",
          msg: "신청자 변경 실패 거절 사유가 존재하지 않습니다.",
        });
      }
      applicants.update({
        confirmed: false,
        comments: comment,
      });
      logger.info("patch /applicant/approved/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "신청자 거절 성공",
        applicant: applicants,
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res.status(400).send({
      result: "fail",
      msg: "신청자 변경 실패",
    });
  }
};

//내가 신청한 점약 목록...!
applicantgetme = async (req, res) => {
  const user = res.locals.user;
  try {
    const applicants = await applicant.findAll({
      include: [
        {
          model: users,
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: lunchs,
          include: [
            { model: lunchdata, as: "locations" },
            {
              model: users,
              as: "host",
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
        },
      ],
      where: { userid: user.userid },
    });
    if (!applicants) {
      logger.error("GET /applicant 신청한 점약이 없음...!");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약이 없음...!",
      });
    } else {
      logger.info("GET /applicant");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약 목록 조회 확인...!",
        applicants: applicants,
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res.status(400).send({
      result: "fail",
      msg: "신청한 점약 조회 실패!",
    });
  }
};

//다른 사람이 신청한 점약목록
applicantgetthor = async (req, res) => {
  const { userid } = req.params;
  try {
    const applicants = await applicant.findAll({
      include: [
        {
          model: users,
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: lunchs,
          include: [
            { model: lunchdata, as: "locations" },
            {
              model: users,
              as: "host",
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
        },
      ],
      where: { userid: userid },
    });
    if (!applicants) {
      //applicants.length
      logger.error("GET /applicant 신청한 점약이 없음...!");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약이 없음...!",
      });
    } else {
      logger.info("GET /applicant");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약 목록 조회 확인...!",
        applicants: applicants,
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res.status(400).send({
      result: "fail",
      msg: "신청한 점약 조회 실패!",
    });
  }
};

module.exports = {
  applicantpost: applicantpost,
  applicantdelete: applicantdelete,
  applicantget: applicantget,
  applicantconfirmed: applicantconfirmed,
  applicantgetme: applicantgetme,
  applicantgetthor: applicantgetthor,
};
