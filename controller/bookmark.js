const { bookmarks, users, lunchs, sequelize, lunchdata, applicant } = require("../models");
const { logger } = require("../config/logger"); //로그
require("date-utils");

// 북마크 추가
bookmarkpost = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const doc = { userid: user.userid, lunchid: lunchid };
    const [bookmark, created] = await bookmarks.findOrCreate({
      where: { userid: user.userid, lunchid: lunchid },
      default: doc,
    });
    if (!created) {
      const a = await bookmarks.destroy({ where: { lunchid: lunchid, userid: user.userid } }); // 특정 데이터만 삭제
      if (a) {
        const query =
          "UPDATE lunchs SET bk_num = bk_num - 1 WHERE lunchid = :lunchid;";
        await sequelize.query(query, {
          replacements: {
            lunchid: lunchid,
          },
          type: sequelize.QueryTypes.UPDATE,
        });
        logger.info("delete /book/:bookmarkid");
        return res.status(200).send({
          result: "success",
          msg: "북마크 삭제 성공",
        });
      }else{
        logger.error(err);
        return res.status(400).send({
          result: "fail",
          msg: "북마크 삭제 실패",
        });
      }
    } else {
      const query =
        "UPDATE lunchs SET bk_num = bk_num + 1 WHERE lunchid = :lunchid;";
      await sequelize.query(query, {
        replacements: {
          lunchid: lunchid,
        },
        type: sequelize.QueryTypes.UPDATE,
      });
      const book =await lunchs.findAll({
        where: [
          {'$bookmarks.bookmarkid$': bookmark.dataValues.bookmarkid },
        ],
        include: [
          { model: lunchdata, as: "locations" },
          {
            model: users,
            as: "host",
            attributes: { exclude: ["location", "password", "salt", "gender"] },
          },
          {
            model: applicant,
            include: [
              {
                model: users,
                attributes: {
                  exclude: ["location", "password", "salt", "gender"],
                },
              },
            ],
            exclude: ["lunchid", "userid"],
          },
          {
          model: bookmarks
        }]
      });
      logger.info("POST /book/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "북마크 추가 성공",
        book: book,
      });
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    return res.status(400).send({
      result: "fail",
      msg: "북마크 추가 실패",
    });
  }
};

// 북마크 가져오기
bookmarkget = async (req, res) => {
  const user = res.locals.user;
  try {
    const book = await lunchs.findAll({
      where: [
        {'$bookmarks.userid$': user.userid },
      ],
      include: [
        { model: lunchdata, as: "locations" },
        {
          model: users,
          as: "host",
          attributes: { exclude: ["location", "password", "salt", "gender"] },
        },
        {
          model: applicant,
          include: [
            {
              model: users,
              attributes: {
                exclude: ["location", "password", "salt", "gender"],
              },
            },
          ],
          exclude: ["lunchid", "userid"],
        },
        {
        model: bookmarks
      }]
    });
    logger.info("GET /book/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "북마크 가져오기 성공",
      bookmarks: book,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "북마크 가져오기 실패",
    });
  }
};

// 북마크 삭제
bookmarkdele = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const a = await bookmarks.destroy({ where: { lunchid: lunchid, userid: user.userid } }); // 특정 데이터만 삭제
    console.log(a);
    if (a) {
      const query =
        "UPDATE lunchs SET bk_num = bk_num - 1 WHERE lunchid = :lunchid;";
      await sequelize.query(query, {
        replacements: {
          lunchid: lunchid,
        },
        type: sequelize.QueryTypes.UPDATE,
      });
      logger.info("delete /book/:bookmarkid");
      return res.status(200).send({
        result: "success",
        msg: "북마크 삭제 성공",
      });
    }else{
      logger.error(err);
      return res.status(400).send({
        result: "fail",
        msg: "북마크 삭제 실패",
      });
    }
  } catch (err) {
    logger.error(err);
    return res.status(400).send({
      result: "fail",
      msg: "북마크 삭제 실패",
    });
  }
};

module.exports = {
  bookmarkpost: bookmarkpost,
  bookmarkget: bookmarkget,
  bookmarkdele: bookmarkdele,
};
