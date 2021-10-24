const express = require('express');
const router = express.Router();
const controller = require('../controller/user')
// const { emailCheck, login, sigup , nickNameCheck } = require('../controller/user')

router.route('/login').post(controller.login,function(req, res){});
router.route('/sinup').post(controller.signup);
router.route('/checkemil').post(controller.emailCheck,function(req, res){});
router.route('/checknickname').post(controller.nickNameCheck,function(req, res){});


module.exports = router;
