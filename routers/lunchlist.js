const express = require("express");
const router = express.Router();
const { getlunchlist, detaillunchpost, postlunchlist } = require("../controller/lunchlist");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/").get(getlunchlist).post(authMiddleware, postlunchlist);
router.route("/:postid").get(detaillunchpost);


module.exports = router;
