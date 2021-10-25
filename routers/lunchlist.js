const express = require("express");
const router = express.Router();
const { getlunchlist } = require("../controller/lunchlist");

router.route("/").get(getlunchlist);

module.exports = router;
