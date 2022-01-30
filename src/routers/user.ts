import * as express from "express";
const router = express.Router();
import userController from "../controller/user";
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')
import authmiddleware from "../middlewares/authMiddleware";
import signupmiddleware from "../middlewares/signupMiddleware";
import upload from "../utils/s3";
import notice from "../controller/notice";

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
