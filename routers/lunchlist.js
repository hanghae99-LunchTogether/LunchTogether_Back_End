const express = require("express");
const router = express.Router();
const middleware = require('../middlewares/authMiddleware');
const { getlunchlist , getlunchposet} = require("../controller/lunchlist");

router.route("/").get(getlunchlist).post(middleware, getlunchposet);

module.exports = router;
