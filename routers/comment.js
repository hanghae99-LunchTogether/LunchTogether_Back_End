const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/authMiddleware");
const { commentget, commentpost } = require("../controller/comment");

router
  .route("/:postid")
  .get(middleware, commentget)
  .post(middleware, commentpost);
router.route("/:commentid").delete(middleware, commentdele);

module.exports = router;
