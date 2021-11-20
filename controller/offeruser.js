const {
  lunchs,
  sequelize,
  useroffer,
  users,
  lunchdata,
  applicant,
} = require("../models");
const { logger } = require("../config/logger"); //로그
require("date-utils");

postlunchlist = async (req, res) => {
  const user = res.locals.user;
  const { userid } = req.params;
  const { title, content, date, locations, membernum } = req.body;
  const postDate = new Date();
  const time = postDate.toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log(
    "타이틀" + title,
    "코맨트" + content,
    "날짜" + date,
    "위치" + locations,
    "맴버수" + membernum,
    "누구랑" + userid
  );
  if(userid === user.userid){
    logger.error("POST /offer 나는 나에게 점약신청을 한다!");
    return res.status(400).send({
      result: "fail",
      msg: "본인에게 점약은 신청불가능 합니다.",
    });
  }
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
      confirmed: false,
      private: true,
    });
    const offerusers = await useroffer.create({
      userid: userid,
      lunchid: lunch.dataValues.lunchid,
    });
    const data = {
      lunch: lunch,
      offerusers: offerusers,
    };
    logger.info("POST /offer");
    return res.status(200).send({
      result: "success",
      msg: "점약 약속" + userid + "에게 신청 성공",
      data: data,
    });
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res.status(400).send({
      result: "fail",
      msg: "약속 신청 실패",
    });
  }
};


offerconfirmed = async (req, res) => {
  const { confirmed } = req.body;
  console.log(req.body);
  const comment = "거절상태 입니다..."
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const applicants = await useroffer.findOne({
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
      where: { lunchid: lunchid, userid: user.userid },
    });

    if (!applicants) {
      logger.error("해당 글이 존재하지 않습니다. 또는 해당 제안받은자가 없습니다.");
      return res.status(400).send({
        result: "fail",
        msg: "승인 변경 실패 해당약속이 존재 하지 않습니다. 또는 해당 제안받은자가 없습니다.",
      });
    } 
    if (confirmed) {
      applicants.update({ confirmed: true });
      logger.info("patch /offer/confirmed/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "제안 승인 성공",
        applicant: applicants,
      });
    } else {
      if (!comment) {
        logger.error("patch /offer/confirmed/:lunchid 거절사유 없음");
        return res.status(400).send({
          result: "fail",
          msg: "신청자 변경 실패 거절 사유가 존재하지 않습니다.",
        });
      }
      applicants.update({
        confirmed: false,
        comments: comment,
      });
      logger.info("patch /offer/confirmed/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "제안 거절 성공",
        applicant: applicants,
      });
    }
  } catch (error) {
    logger.error(error);
    console.log(error);
    return res.status(400).send({
      result: "fail",
      msg: "제안 변경 실패",
    });
  }
};


test = async (req, res) => {
  try {
    await lunchdata.findAll({
      attributes: ['id',
          [
          sequelize.fn('ST_Distance',
              sequelize.fn('POINT', sequelize.col('y'), sequelize.col('x')), sequelize.fn('POINT', "37.498777145173", "127.029090699483")),
          'distance'
          ],
      ],
      order : [[sequelize.literal('distance')]]
      
      }).then(async (store) =>{
        console.log(store)
        res.status(200).send(store)
      })
      
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
};



module.exports = {
    postlunchlist:postlunchlist,
    offerconfirmed: offerconfirmed,
    test:test
  };
  
