const { lunchs, sequelize, users, lunchdata, applicant } = require("../models");
const { logger } = require("../config/logger"); //로그
require("date-utils");

getlunchlist = async (req, res) => {
  try {
    const lunch = await lunchs.findAll({
      include: [
        { model: users, as: "host" ,attributes: { exclude: ['location','password','salt','gender'] }},
        { model: lunchdata, as: "locations" },
        { model: applicant , include: [{model: users}]}
      ],
      order: [["date", "DESC"]],
    });
    logger.info("GET /lunchpost/");
    return res.status(200).send({
      result: "success",
      msg: "리스트 불러오기 성공",
      lunch: lunch,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "리스트 불러오기 실패",
    });
  }
};

detaillunchpost = async (req, res) => {
  const { lunchid } = req.params;
  try {
    const lunchDetail = await lunchs.findOne({
      include: [
        { model: users, as: "host", attributes: { exclude: ['location','password','salt','gender'] }},
        { model: lunchdata, as: "locations" },
        { model: applicant , include: [{model: users}]}
      ],
      where: { lunchid: lunchid },
    });
    const data = { lunch: lunchDetail };
    logger.info("GET /lunchpost/:lunchId");
    return res.status(200).send({
      result: "success",
      msg: "점심약속 상세정보 성공",
      data: data,
    });
  } catch (err) {
    console.log(err);
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "점심약속 상세정보 실패",
    });
  }
};

postlunchlist = async (req, res) => {
  const user = res.locals.user;
  const { title, content, date, location, membernum, duration } = req.body;
  const postDate = new Date();
  const time = postDate.toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log(
    "타이틀" + title,
    "코맨트" + content,
    "날짜" + date,
    "위치" + location,
    "맴버수" + membernum,
    "몇시간" + duration
  );
  try {
    //쿼리문 해석 .. lunchdata에 해당 객체를 넣는데 lunchdata DB안에 해당객체의 id값이 존재하는 경우 넣지 않는다.
    const query =
      "insert into lunchdata (id,address_name,road_address_name,category_group_name,place_name,place_url,phone,x,y) select :id,:address_name,:road_address_name,:category_group_name,:place_name,:place_url,:phone,:x,:y From dual WHERE NOT exists(select * from lunchdata where id = :id);";
    const locationdb = await sequelize.query(query, {
      replacements: {
        id: location.id,
        address_name: location.address_name,
        road_address_name: location.road_address_name,
        category_group_name: location.category_group_name,
        place_name: location.place_name,
        place_url: location.place_url,
        phone: location.phone,
        x: location.x,
        y: location.y,
        id: location.id,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    const lunch = await lunchs.create({
      userid: user.userid,
      title: title,
      content: content,
      date: date,
      location: location.id,
      time: time,
      membernum: membernum,
      duration: duration,
      confirmed: false,
      private: false,
    });
    console.log(lunch);
    const data = { lunch: lunch };
    logger.info("POST /lunchPost");
    return res.status(200).send({
      result: "success",
      msg: "게시글 작성 성공",
      data: data,
    });
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res.status(400).send({
      result: "fail",
      msg: "게시글 작성 실패",
    });
  }
};

updatelunchlist = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  const { title, content, date, location, membernum, duration } = req.body;
  const postDate = new Date();
  const time = postDate.toFormat("YYYY-MM-DD HH24:MI:SS");

  try {
    let querys = "UPDATE lunchs SET";
    querys = querys + " updatedAt = now(),";
    if (title) querys = querys + " title = :title,";
    if (content) querys = querys + " content = :content,";
    if (date) querys = querys + " date = :date,";
    if (location) querys = querys + " location = :location,";
    if (time) querys = querys + " time = :time,";
    if (membernum) querys = querys + " membernum = :membernum,";
    if (duration) querys = querys + " duration = :duration,";

    querys = querys.slice(0, -1);

    querys = querys + " WHERE lunchid = :lunchid AND userid = :userid;";
    await sequelize.query(querys, {
      replacements: {
        lunchid: lunchid,
        title: title,
        content: content,
        date: date,
        location: location,
        time: time,
        membernum: membernum,
        duration: duration,
        userid: user.userid,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    const lunchDetail = await lunchs.findOne({
      include: [
        { model: users, as: "host", attributes: { exclude: ['location','password','salt','gender'] }},
        { model: lunchdata , as: "locations"},
      ],
      where: { lunchid: lunchid },
    });
    if (!lunchDetail) {
      logger.error("PATCH /lunchPost 존재하지 않는 약속");
      return res.status(400).send({
        result: "fail",
        msg: "해당 약속 존재하지 않음",
      });
    }
    const data = { lunch: lunchDetail };
    logger.info("PATCH /lunchPost");
    return res.status(200).send({
      result: "success",
      msg: "약속 수정 성공",
      data: data,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "약속 수정 실패",
    });
  }
};

deletelunchlist = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const querys =
      "delete from lunchs where lunchid = :lunchid AND userid = :userid";
    const test = await sequelize.query(querys, {
      replacements: {
        lunchid: lunchid,
        userid: user.userid,
      },
      type: sequelize.QueryTypes.DELETE,
    });
    console.log(test);
    logger.info("DELETE /lunchPost");
    return res.status(200).send({
      result: "success",
      msg: "약속 삭제 성공",
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "약속 삭제 실패",
    });
  }
};

onairlunch = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const lunchDetail = await lunchs.findOne({
      include: [
        { model: users, as: "host", attributes: { exclude: ['location','password','salt','gender'] }},
        { model: lunchdata ,as: "locations"},
        { model: applicant , include: [{model: users}]}
      ],
      where: { lunchid: lunchid, userid: user.userid },
    });
    if (lunchDetail) {
      lunchDetail.update({ status: "onair" });
      logger.info("PATCH /lunchPost/onair");
      return res.status(200).send({
        result: "success",
        msg: "점약 승인 성공",
        lunch: lunchDetail,
      });
    } else {
      logger.error("PATCH /lunchPost/onair 해당 점약 없음 해당 오너가아님");
      return res.status(400).send({
        result: "fail",
        msg: "점약 승인 실패 해당 점약 없음 or 해당 점약 오너가 아님",
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res.status(400).send({
      result: "fail",
      msg: "점약 진행 오류",
    });
  }
};

cancellunch = async (req, res) => {
  const { lunchid } = req.params;
  const { comment } = req.body;
  const user = res.locals.user;

  try {
    const lunchDetail = await lunchs.findOne({
      include: [
        { model: users, as: "host", attributes: { exclude: ['location','password','salt','gender'] }},
        { model: lunchdata,as: "locations" },
        { model: applicant , include: [{model: users}]}
      ],
      where: { lunchid: lunchid, userid: user.userid },
    });
    if (lunchDetail) {
      const content = lunchDetail.content + "취소 사유:" + comment;
      lunchDetail.update({ status: "cancel", content: content });
      logger.info("PATCH /lunchPost/cancel");
      return res.status(200).send({
        result: "success",
        msg: "점약 취소 성공",
        lunch: lunchDetail,
      });
    }
    else{
      logger.error("PATCH /lunchPost/cancel 취소 실패 해당 점약이 없거나 or 점약 오너가아님");
      return res.status(400).send({
        result: "fail",
        msg: "점약 취소 실패 해당 점약이 없거나 점약 오너가 아니여",
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
      return res.status(400).send({
        result: "fail",
        msg: "점약 취소 오류",
      });
  }
};

donelunch = async (req, res)=>{
  const { lunchid } = req.params;
  const user = res.locals.user;
  
  try {
    const lunchDetail = await lunchs.findOne({
      include: [
        { model: users, as: "host", attributes: { exclude: ['location','password','salt','gender'] }},
        { model: lunchdata,as: "locations" },
        { model: applicant , include: [{model: users}]}
      ],
      where: { lunchid: lunchid, userid: user.userid },
    });
    if (lunchDetail) {
      lunchDetail.update({ status: "done"});
      logger.info("PATCH /lunchPost/done");
      return res.status(200).send({
        result: "success",
        msg: "점약 종료 성공",
        lunch: lunchDetail,
      });
    }
    else{
      logger.error("PATCH /lunchPost/done 해당 점약 오너가 아니거나 점약이 존재하지않음");
      return res.status(400).send({
        result: "fail",
        msg: "점약 종료 실패 점약 오너아님 || 점약 존재 ㄴㄴ",
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error)
      return res.status(400).send({
        result: "fail",
        msg: "점약 종료 오류",
      });
  }
}

module.exports = {
  getlunchlist: getlunchlist,
  detaillunchpost: detaillunchpost,
  postlunchlist: postlunchlist,
  updatelunchlist: updatelunchlist,
  deletelunchlist: deletelunchlist,
  onairlunch: onairlunch,
  cancellunch: cancellunch,
  donelunch: donelunch,
};
