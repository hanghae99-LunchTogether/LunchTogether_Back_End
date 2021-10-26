const express = require("express");
const router = express.Router();
const {
  getlunchlist,
  detaillunchpost,
  postlunchlist,
  updatelunchlist,
} = require("../controller/lunchlist");
const authMiddleware = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(getlunchlist)
  .post(authMiddleware, postlunchlist);
  
router.route("/:lunchid").get(detaillunchpost).patch(authMiddleware, updatelunchlist);

module.exports = router;
