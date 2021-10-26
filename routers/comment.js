const express = require("express");
const router = express.Router();
const { commentget, commentpost } = require("../controller/comment");

router.route("/:postid").get(commentget);
router.route("/:postid").post(commentpost);

module.exports = router;
