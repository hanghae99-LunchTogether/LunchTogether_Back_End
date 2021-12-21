import * as express from "express";
const router = express.Router();
import userController from "../controller/user";
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')
const authmiddleware = require("../middlewares/authMiddleware");
const signupmiddleware = require("../middlewares/signupMiddleware");
const upload = require("../utils/s3");
const notice = require("../controller/notice");

router.route("/login").get(authmiddleware, userController.getuser);
router.route("/signup").post(signupmiddleware, userController.signup);
router.route("/checkemail").post(userController.checkemail);
router.route("/checknickname").post(userController.checknickname);
router
  .route("/myprofile")
  .patch(authmiddleware, upload.single("image"), userController.upusers)
  .get(authmiddleware, userController.getdeuser);
router.route("/myprofile/:userid").get(userController.getotheruser);
router.route("/kakaologin").post(userController.loginkakao);
router.route("/alluser").get(userController.testusers);
router.route("/user/notice").delete(authmiddleware, notice.noticedele);

export default router;
