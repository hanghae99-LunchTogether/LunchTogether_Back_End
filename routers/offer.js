const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { postlunchlist } = require("../controller/offeruser");

router.route("/:userid").post(authMiddleware, postlunchlist);

module.exports = router;
