const express = require("express");
const router = express.Router();
const { getlunchlist, detaillunchpost } = require("../controller/lunchlist");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/").get(getlunchlist);
router.route("/:postid").get(authMiddleware, detaillunchpost);

module.exports = router;
