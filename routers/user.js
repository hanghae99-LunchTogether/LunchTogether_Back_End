const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')
const authmiddleware = require("../middlewares/authMiddleware");
const signupmiddleware = require("../middlewares/signupMiddleware");
const isuser = require("../middlewares/doMiddlewares");
const upload = require("../utils/s3");
const notice = require('../controller/notice')

router.route("/login").get(authmiddleware, controller.getuser);
router.route("/signup").post(signupmiddleware, controller.signup);
router.route("/checkemail").post(controller.checkemail);
router.route("/checknickname").post(controller.checknickname);
router
  .route("/myprofile")
  .patch(authmiddleware, upload.single("image"), controller.upusers)
  .get(authmiddleware, controller.getdeuser);
router.route("/myprofile/:userid").get(controller.getotheruser);
router.route("/kakaologin").post(controller.loginkakao);
router.route("/alluser").get(isuser,controller.allusers);
router.route("/user/notice").delete(authmiddleware,notice.noticedele);

module.exports = router;
