const express = require("express");
const router = express.Router();
const {
  getlunchlist,
  detaillunchpost,
  postlunchlist,
  updatelunchlist,
  deletelunchlist,
  onairlunch,
  cancellunch,
  donelunch,
} = require("../controller/lunchlist");
const authMiddleware = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(getlunchlist)
  .post(authMiddleware, postlunchlist);
  
router.route("/:lunchid").get(detaillunchpost).patch(authMiddleware, updatelunchlist).delete(authMiddleware,deletelunchlist);

router.route("/onair/:lunchid").patch(authMiddleware, onairlunch);
router.route("/cancel/:lunchid").patch(authMiddleware, cancellunch);
router.route("/done/:lunchid").patch(authMiddleware, donelunch);


module.exports = router;
