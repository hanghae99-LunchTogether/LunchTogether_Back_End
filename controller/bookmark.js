const { bookmarks, users, lunchs, sequelize } = require("../models");
const { logger } = require("../config/logger"); //로그
require("date-utils");

// 북마크 추가
bookmarkpost = async (req, res) => {
  const { lunchid } = req.params;
  const user = res.locals.user;
  try {
    const [user, created] = await bookmarks.findOrCreate({
      where: { userid: user.userid },
      default: { lunchid: lunchid },
    });
    if (created) {
      return;
    }
    // const createdbookmark = await bookmarks.findOne({
    //   include: [{ model: lunchs }],
    //   where: {
    //     lunchid: lunchid,
    //     userid: user.userid,
    //   },
    // });
    // console.log("여기다", createdbookmark);
    logger.info("POST /book/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "북마크 추가 성공",
      bookmarks: bookmark,
    });
  } catch (err) {
    logger.error(err);
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
    const isbookmarks = await bookmarks.findAll({
      include: [{ model: lunchs }],
      where: { userid: user.userid },
    });
    logger.info("GET /book/:lunchid");
    return res.status(200).send({
      result: "success",
      msg: "북마크 가져오기 성공",
      bookmarks: isbookmarks,
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
  const { bookmarkid } = req.params;
  const user = res.locals.user;
  try {
    const query =
      "delete from bookmarks where bookmarkid = :bookmarkid AND userid = :userid;";
    const bookmark = await sequelize.query(query, {
      replacements: {
        bookmarkid: bookmarkid,
        userid: user.userid,
      },
      type: sequelize.QueryTypes.DELETE,
    });

    logger.info("delete /book/:bookmarkid");
    return res.status(200).send({
      result: "success",
      msg: "북마크 삭제 성공",
    });
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
