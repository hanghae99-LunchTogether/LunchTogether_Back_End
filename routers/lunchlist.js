const express = require("express");
const router = express.Router();
const {
  getlunchlist,
  detaillunchpost,
  postlunchlist,
  updatelunchlist,
  deletelunchlist,
  confirmedlunch,
  privatelunch,
  bookmarklunch,
} = require("../controller/lunchlist");
const authMiddleware = require("../middlewares/authMiddleware");
const isuser = require("../middlewares/doMiddlewares");

router.route("/").get(isuser,getlunchlist).post(authMiddleware, postlunchlist);

router
  .route("/:lunchid")
  .get(detaillunchpost)
  .patch(authMiddleware, updatelunchlist)
  .delete(authMiddleware, deletelunchlist);

router.route("/confirmed/:lunchid").patch(authMiddleware, confirmedlunch);

router.route("/private/:lunchid").patch(authMiddleware, privatelunch);

// router.route("/bookmark/:lunchid").patch(authMiddleware, bookmarklunch);

module.exports = router;
