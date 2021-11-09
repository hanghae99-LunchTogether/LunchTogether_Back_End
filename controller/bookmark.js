const { bookmarks, users, lunchs, sequelize } = require("../models");
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
      return res.status(400).send({
        result: "fail",
        msg: "이미 북마크 되어있는 점심 약속입니다.",
      });
    } else {
      console.log(bookmark.dataValues.bookmarkid);
      const books = await bookmarks.findOne({
        include: [{ model: lunchs }],
        where: { bookmarkid: bookmark.dataValues.bookmarkid },
      });
      logger.info("POST /book/:lunchid");
      return res.status(200).send({
        result: "success",
        msg: "북마크 추가 성공",
        book: books,
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
