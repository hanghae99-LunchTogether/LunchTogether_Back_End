const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')
const middleware = require("../middlewares/authMiddleware");
const upload = require("../utils/s3");
const passport = require("passport");

router
  .route("/login")
  .post(controller.login, function (req, res) {})
  .get(middleware, controller.getuser);
router.route("/signup").post(controller.signup);
// router.route('/checkemil').post(controller.emailCheck,function(req, res){});
// router.route('/checknickname').post(controller.nickNameCheck,function(req, res){});
router
  .route("/myProfile")
  .patch(middleware, upload.single("image"), controller.upusers)
  .get(middleware, controller.getuser);
router.route("/myProfile/:userid").get(controller.getotheruser);

// 카카오 controller

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/", // 로그인에 실패했을 경우 해당 라우터로 이동한다
  }),
  (req, res) => {
    // 로그인에 성공했을 경우, 다음 라우터가 실행된다

    res.redirect("/");
  }
);

module.exports = router;
