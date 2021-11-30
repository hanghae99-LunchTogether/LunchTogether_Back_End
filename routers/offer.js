const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { postlunchlist ,offerconfirmed, test, dotest} = require("../controller/offeruser");

router.route("/:userid").post(authMiddleware, postlunchlist);
router.route("/confirmed/:lunchid").patch(authMiddleware, offerconfirmed);
router.route("/").get(test);
router.route("/test").post(dotest)

module.exports = router;
