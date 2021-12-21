const express = require("express");
const router = express.Router();
const authmiddleware = require("../middlewares/authMiddleware");
const {
  bookmarkget,
  bookmarkpost,
  bookmarkdele,
} = require("../controller/bookmark");

router.route("/:lunchid").post(authmiddleware, bookmarkpost).delete(authmiddleware, bookmarkdele);
router.route("/").get(authmiddleware, bookmarkget);

module.exports = router;
