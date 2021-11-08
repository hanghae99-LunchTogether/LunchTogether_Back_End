const { sequelize , applicant, users, lunchs } = require("../models");
const Op = sequelize.Op;
const { logger } = require("../config/logger"); //로그


//점약 신청
applicantpost = async (req, res) => {
  const { lunchid } = req.params; // params에 lunchid 객체
  const user = res.locals.user;
  try {
    const query =
      "insert into applicants set status = :status, statusdesc = :statusdesc ,lunchid = :lunchid, userid = :userid;";
    const applicant = await sequelize.query(query, {
      replacements: {
        status: "applied",
        statusdesc: true,
        lunchid: lunchid,
        userid: user.userid,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    console.log(applicant);
    logger.info("POST /comment/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "신청 작성 성공",
    });
  } catch (err) {
    logger.error(err);
    console.log(err)
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
    const query =
      "select users.nickname, applicants.* from applicants inner join users on users.userid = applicants.userid where lunchid = :lunchid;";
    const applicant = await sequelize.query(query, {
      replacements: {
        lunchid: lunchid,
      },
      type: sequelize.QueryTypes.SELECT,
    });
    
    if(!applicant.length){
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
      applicant: applicant,
    });
  } catch (err) {
    logger.error(err);
    console.log(err)
    return res.status(400).send({
      result: "fail",
      msg: "신청자 조회 실패",
    });
  }
};


//신청 승인여부
applicantapproved = async (req, res) =>{
  const { userid , statusdesc, comment } = req.body;
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const applicants = await applicant.findOne({
      include: [
        { model: users, attributes: ["nickname", "image"] },
        { model: lunchs }
      ],
      where: 
      {lunchid: lunchid, userid: userid },
    });
    if(!applicants){
      logger.error("해당 글이 존재하지 않습니다. 또는 해당 신청자가 없습니다.");
      return res.status(400).send({
        result: "fail",
        msg: "신청자 변경 실패 해당약속이 존재 하지 않습니다. 또는 해당 신청자가 없습니다.",
      });
    }else if(applicant.lunchs.userid !== user.userid ){
      logger.error("해당 글의 오너가 아님");
      return res.status(400).send({
        result: "fail",
        msg: "신청자 변경 실패 해당약속의 오너가 아님",
      });
    }
    if(statusdesc){
      applicants.update({ status : "approved", statusdesc : statusdesc})
      logger.info("patch /applicant/approved/:lunchid");
        return res.status(200).send({
          result: "success",
          msg: "신청자 승인 성공",
          applicant: applicants
        });
    }else{
      applicants.update({ status : "approved", statusdesc : statusdesc, comments: comment})
      logger.info("patch /applicant/approved/:lunchid");
        return res.status(200).send({
          result: "success",
          msg: "신청자 거절 성공",
          applicant: applicants
        });
    }
  } catch (error) {
    logger.error(error);
    console.log(error)
    return res.status(400).send({
      result: "fail",
      msg: "신청자 변경 실패",
    });
  }
}




//참석 여부
applicantconfirmed = async (req, res) =>{
  const { statusdesc , comment } = req.body;
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const applicants = await applicant.findOne({
      where: 
      {lunchid: lunchid, userid: user.userid },
    });
    if(!applicants){
      logger.error("해당 글이 존재하지 않습니다. 또는 해당 신청자가 없습니다.");
      return res.status(400).send({
        result: "fail",
        msg: "신청자 변경 실패 해당약속이 존재 하지 않습니다. 또는 해당 신청자가 없습니다.",
      });
    }
    if(statusdesc){
      applicants.update({ status : "confirmed", statusdesc : statusdesc})
      logger.info("patch /applicant/confirmed/:lunchid");
        return res.status(200).send({
          result: "success",
          msg: "신청자 참석 확인 성공",
          applicant: applicants
        });
    }else{
      applicants.update({ status : "confirmed", statusdesc : statusdesc, comments: comment})
      logger.info("patch /applicant/confirmed/:lunchid");
        return res.status(200).send({
          result: "success",
          msg: "신청자 참석 거절 성공",
          applicant: applicants
        });
    }
  } catch (error) {
    logger.error(error);
    console.log(error)
    return res.status(400).send({
      result: "fail",
      msg: "신청자 변경 실패",
    });
  }
}

//내가 신청한 점약 목록...!
applicantgetme = async (req, res)=>{
  const user = res.locals.user;
  try {
    const applicants = await applicant.findAll({
      include: [
        { model: users, attributes: ["nickname", "image"] },
        { model: lunchs }
      ],
      where: 
      { userid: user.userid },
    });
    if(!applicants){
      logger.error("GET /applicant 신청한 점약이 없음...!");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약이 없음...!",
      });
    }
    else{
      logger.info("GET /applicant");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약 목록 조회 확인...!",
        applicants : applicants
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error)
    return res.status(400).send({
      result: "fail",
      msg: "신청한 점약 조회 실패!",
    });
  }
}


//다른 사람이 신청한 점약목록
applicantgetthor = async (req, res)=>{
  const { userid } = req.params;
  try {
    const applicants = await applicant.findAll({
      include: [
        { model: users },
        { model: lunchs }
      ],
      where: 
      { userid: userid },
    });
    if(!applicants){//applicants.length
      logger.error("GET /applicant 신청한 점약이 없음...!");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약이 없음...!",
      });
    }
    else{
      logger.info("GET /applicant");
      return res.status(200).send({
        result: "success",
        msg: "신청한 점약 목록 조회 확인...!",
        applicants : applicants
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error)
    return res.status(400).send({
      result: "fail",
      msg: "신청한 점약 조회 실패!",
    });
  }
}



module.exports = {
  applicantpost: applicantpost,
  applicantdelete: applicantdelete,
  applicantget: applicantget,
  applicantapproved: applicantapproved,
  applicantconfirmed: applicantconfirmed,
  applicantgetme: applicantgetme,
  applicantgetthor: applicantgetthor
};
