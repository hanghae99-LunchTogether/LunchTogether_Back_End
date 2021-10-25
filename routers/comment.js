const express = require("express");
const router = express.Router();
const { commentget } = require("../controller/comment");

router.route('/:postid').post(commentget);

module.exports = router;
