const express = require('express');
const router = express.Router();
const controller = require('../controller/user')
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')
const middleware = require('../middlewares/authMiddleware');
const upload = require('../utils/s3')

router.route('/login').post(controller.login,function(req, res){});
router.route('/signup').post(controller.signup);
// router.route('/checkemil').post(controller.emailCheck,function(req, res){});
// router.route('/checknickname').post(controller.nickNameCheck,function(req, res){});
router.route('/login').get(middleware,controller.getuser)
router.route('/myProfile').patch(middleware, upload.single("image"),controller.upusers)



module.exports = router;
