const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/authMiddleware");
const {
  commentget,
  commentpost,
  commentdele,
} = require("../controller/comment");

router
  .route("/:lunchid")
  .get(commentget)
  .post(authmiddleware, commentpost);
router.route("/:commentid").delete(authmiddleware, commentdele);

module.exports = router;
