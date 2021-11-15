const express = require('express');
const router = express.Router();
const controller = require('../controller/user')
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')
const middleware = require('../middlewares/authMiddleware');
const upload = require('../utils/s3')

router.route('/login').get(middleware,controller.getuser);
router.route('/signup').post(controller.signup);
router.route('/checkemail').post(controller.checkemail);
router.route('/checknickname').post(controller.checknickname);
router.route('/myprofile').patch(middleware, upload.single("image"),controller.upusers).get(middleware,controller.getdeuser);
router.route('/myprofile/:userid').get(controller.getotheruser);
router.route('/kakaologin').post(controller.loginkakao);
router.route('/alluser').get(controller.testusers);

module.exports = router;
