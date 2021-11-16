const { lunchs, sequelize, users, lunchdata, applicant } = require("../models");
const { logger } = require("../config/logger"); //로그

require("date-utils");

getlunchlist = async (req, res) => {
  const user = res.locals.user;
  try {
    let pageNum = req.query.page; // 요청 페이지 넘버
    console.log(pageNum);
    let offset = 0;
    if(pageNum > 1){
      offset = 12 * (pageNum - 1);
    }
    const lunch = await lunchs.findAll({
      include: [
        { model: users, as: "host" },
        { model: lunchdata, as: "locations" },
        { model: applicant, include: [{ model: users }] },
      ],
      where: { private: false },
      offset: offset,
      limit: 12,
      order: [["date", "DESC"]],
    });
    if(user){
      const book = user.book
      for(i of lunch){
        if(user.book.includes(i.dataValues.lunchid)) i.dataValues.isbook = true;
        console.log(i.dataValues.lunchid);
      }
    }
    logger.info("GET /lunchpost/");
    return res.status(200).send({
      result: "success",
      msg: "리스트 불러오기 성공",
      lunch: lunch,
    });
  } catch (err) {
    logger.error(err);
    console.log(err);
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
        { model: users, as: "host" },
        { model: lunchdata, as: "locations" },
        { model: applicant, include: [{ model: users }] },
      ],
      where: { lunchid: lunchid },
    });
    // const today = new Date();
    // console.log(lunchDetail.dataValues.time);
    // let OBJt = new Date();
    // OBJt.setHours(OBJt.getHours()+9);
    // console.log(OBJt);const nDate = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});

    // console.log(nDate);
    // let STRt = OBJt.toString();
    // // console.log(STRt);
    // let a = new Date(lunchDetail.dataValues.time);
    // a.setHours(a.getHours()+lunchDetail.dataValues.duration)
    // console.log(a);
    // lunchDetail.dataValues.duration = a;
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
  const { title, content, date, locations, membernum, duration } = req.body;
  const postDate = new Date();
  const time = postDate.toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log(
    "타이틀" + title,
    "코맨트" + content,
    "날짜" + date,
    "위치" + locations,
    "맴버수" + membernum,
    "몇시간" + duration
  );
  try {
    //쿼리문 해석 .. lunchdata에 해당 객체를 넣는데 lunchdata DB안에 해당객체의 id값이 존재하는 경우 넣지 않는다.
    const query =
      "insert into lunchdata (id,address_name,road_address_name,category_group_name,place_name,place_url,phone,x,y) select :id,:address_name,:road_address_name,:category_group_name,:place_name,:place_url,:phone,:x,:y From dual WHERE NOT exists(select * from lunchdata where id = :id);";
    const locationdb = await sequelize.query(query, {
      replacements: {
        id: locations.id,
        address_name: locations.address_name,
        road_address_name: locations.road_address_name,
        category_group_name: locations.category_group_name,
        place_name: locations.place_name,
        place_url: locations.place_url,
        phone: locations.phone,
        x: locations.x,
        y: locations.y,
        id: locations.id,
      },
      type: sequelize.QueryTypes.INSERT,
    });
    const lunch = await lunchs.create({
      userid: user.userid,
      title: title,
      content: content,
      date: date,
      location: locations.id,
      time: time,
      membernum: membernum,
      duration: duration,
      confirmed: false,
      private: false,
      bk_num: 0,
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
  const { title, content, date, locations, membernum, duration } = req.body;
  const postDate = new Date();
  const time = postDate.toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log(title, content, date, locations, membernum, duration);
  try {
    let querys = "UPDATE lunchs SET";
    querys = querys + " updatedAt = now(),";
    if (title) querys = querys + " title = :title,";
    if (content) querys = querys + " content = :content,";
    if (date) querys = querys + " date = :date,";

    if (locations) {
      const query =
        "insert into lunchdata (id,address_name,road_address_name,category_group_name,place_name,place_url,phone,x,y) select :id,:address_name,:road_address_name,:category_group_name,:place_name,:place_url,:phone,:x,:y From dual WHERE NOT exists(select * from lunchdata where id = :id);";
      const locationdb = await sequelize.query(query, {
        replacements: {
          id: locations.id,
          address_name: locations.address_name,
          road_address_name: locations.road_address_name,
          category_group_name: locations.category_group_name,
          place_name: locations.place_name,
          place_url: locations.place_url,
          phone: locations.phone,
          x: locations.x,
          y: locations.y,
          id: locations.id,
        },
        type: sequelize.QueryTypes.INSERT,
      });
      querys = querys + " location = :location,";
    }
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
        location: locations.id,
        time: time,
        membernum: membernum,
        duration: duration,
        userid: user.userid,
      },
      type: sequelize.QueryTypes.UPDATE,
    });
    const lunchDetail = await lunchs.findOne({
      include: [
        { model: users, as: "host" },
        { model: lunchdata, as: "locations" },
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

privatelunch = async (req, res) => {
  const { lunchid } = req.params;
  const { private } = req.body;
  const user = res.locals.user;

  const lunchDetail = await lunchs.findOne({
    include: [
      { model: users, as: "host" },
      { model: lunchdata, as: "locations" },
      { model: applicant, include: [{ model: users }] },
    ],
    where: { lunchid: lunchid, userid: user.userid },
  });

  if (private) {
    try {
      if (lunchDetail) {
        lunchDetail.update({ private: true });
        logger.info("PATCH /lunchPost/private");
        return res.status(200).send({
          result: "success",
          msg: "점약 비공개 성공",
          lunch: lunchDetail,
        });
      } else {
        logger.error("PATCH /lunchPost/private 해당 점약 없음 해당 오너가아님");
        return res.status(400).send({
          result: "fail",
          msg: "점약 비공개 실패 해당 점약 없음 or 해당 점약 오너가 아님",
        });
      }
    } catch (error) {
      logger.error(error);
      console.log(error);
      return res.status(400).send({
        result: "fail",
        msg: "점약 비공개 오류",
      });
    }
  } else {
    try {
      if (lunchDetail) {
        lunchDetail.update({ private: false });
        logger.info("PATCH /lunchPost/private");
        return res.status(200).send({
          result: "success",
          msg: "점약 보이기 성공",
          lunch: lunchDetail,
        });
      } else {
        logger.error("PATCH /lunchPost/private 해당 점약 없음 해당 오너가아님");
        return res.status(400).send({
          result: "fail",
          msg: "점약 보이기 실패 해당 점약 없음 or 해당 점약 오너가 아님",
        });
      }
    } catch (error) {
      logger.error(error);
      console.log(error);
      return res.status(400).send({
        result: "fail",
        msg: "점약 보이기 오류",
      });
    }
  }
};

confirmedlunch = async (req, res) => {
  const { lunchid } = req.params;
  const { confirmed } = req.body;
  const user = res.locals.user;

  const lunchDetail = await lunchs.findOne({
    include: [
      { model: users, as: "host" },
      { model: lunchdata, as: "locations" },
      { model: applicant, include: [{ model: users }] },
    ],
    where: { lunchid: lunchid, userid: user.userid },
  });

  if (confirmed) {
    try {
      if (lunchDetail) {
        lunchDetail.update({ confirmed: true });
        logger.info("PATCH /lunchPost/confirmed");
        return res.status(200).send({
          result: "success",
          msg: "점약 컨펌 성공",
          lunch: lunchDetail,
        });
      } else {
        logger.error("PATCH /lunchPost/private 해당 점약 없음 해당 오너가아님");
        return res.status(400).send({
          result: "fail",
          msg: "점약 컨펌 실패 해당 점약 없음 or 해당 점약 오너가 아님",
        });
      }
    } catch (error) {
      logger.error(error);
      console.log(error);
      return res.status(400).send({
        result: "fail",
        msg: "점약 컨펌 오류",
      });
    }
  } else {
    try {
      if (lunchDetail) {
        lunchDetail.update({ confirmed: false });
        logger.info("PATCH /lunchPost/confirmed");
        return res.status(200).send({
          result: "success",
          msg: "점약 컨펌취소 성공",
          lunch: lunchDetail,
        });
      } else {
        logger.error(
          "PATCH /lunchPost/confirmed 해당 점약 없음 해당 오너가아님"
        );
        return res.status(400).send({
          result: "fail",
          msg: "점약 컨펌취소 실패 해당 점약 없음 or 해당 점약 오너가 아님",
        });
      }
    } catch (error) {
      logger.error(error);
      console.log(error);
      return res.status(400).send({
        result: "fail",
        msg: "점약 컨펌취소 오류",
      });
    }
  }
};

bookmarklunch = async (req, res) => {
  const { lunchid } = req.params;
  const { bk_bool } = req.body;

  const lunchDetail = await lunchs.findOne({
    include: [
      { model: users, as: "host" },
      { model: lunchdata, as: "locations" },
      { model: applicant, include: [{ model: users }] },
    ],
    where: { lunchid: lunchid },
  });
  let { bk_num } = lunchDetail;

  if (bk_bool) {
    try {
      if (lunchDetail) {
        lunchDetail.update({ bk_num: bk_num + 1 });
        logger.info("PATCH /lunchPost/bookmark");
        return res.status(200).send({
          result: "success",
          msg: "북마크 적용 성공",
          lunch: lunchDetail,
        });
      } else {
        logger.error("PATCH /lunchPost/bookmark 해당 점약 없음 ");
        return res.status(400).send({
          result: "fail",
          msg: "점약 북마크 실패 해당 점약 없음 ",
        });
      }
    } catch (error) {
      logger.error(error);
      console.log(error);
      return res.status(400).send({
        result: "fail",
        msg: "점약 북마크 오류",
      });
    }
  } else {
    try {
      if (lunchDetail) {
        lunchDetail.update({ bk_num: bk_num - 1 });
        logger.info("PATCH /lunchPost/bookmark");
        return res.status(200).send({
          result: "success",
          msg: "점약 북마크취소 성공",
          lunch: lunchDetail,
        });
      } else {
        logger.error("PATCH /lunchPost/bookmark 해당 점약 없음 ");
        return res.status(400).send({
          result: "fail",
          msg: "점약 북마크취소 실패 해당 점약 없음 ",
        });
      }
    } catch (error) {
      logger.error(error);
      console.log(error);
      return res.status(400).send({
        result: "fail",
        msg: "점약 북마크취소 오류",
      });
    }
  }
};
module.exports = {
  getlunchlist: getlunchlist,
  detaillunchpost: detaillunchpost,
  postlunchlist: postlunchlist,
  updatelunchlist: updatelunchlist,
  deletelunchlist: deletelunchlist,
  confirmedlunch: confirmedlunch,
  privatelunch: privatelunch,
  bookmarklunch: bookmarklunch,
};
