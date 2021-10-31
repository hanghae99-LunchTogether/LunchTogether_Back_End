const express = require('express');
const router = express.Router();
const controller = require('../controller/user')
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')
const middleware = require('../middlewares/authMiddleware');
const upload = require('../utils/s3')

router.route('/login').post(controller.login,function(req, res){}).get(middleware,controller.getuser);
router.route('/signup').post(controller.signup);
router.route('/checkemil').post(function(req, res){
    const { email } = req.body;
    if(controller.emailCheck(email)){
        res.status(200).send({ result: "success", msg: "이메일 중복", data: false });
    }else{
        res
      .status(200)
      .send({ result: "success", msg: "중복이메일 없음", data: true });
    }
});
router.route('/checknickname').post(function(req, res){
    const { nickname } = req.body;
    if(controller.nickNameCheck(nickname)){
        res.status(200).send({ result: "success", msg: "닉네임 중복", data: false });
    }else{
        res
      .status(200)
      .send({ result: "success", msg: "중복닉네임 없음", data: true });
    }
});
router.route('/myprofile').patch(middleware, upload.single("image"),controller.upusers).get(middleware,controller.getuser);
router.route('/myprofile/:userid').get(controller.getotheruser)


module.exports = router;
