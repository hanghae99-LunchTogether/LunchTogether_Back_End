const express = require('express');
const router = express.Router();
import usercontroll from "../controller/user"

router.route('/login').post(usercontroll.login);
router.route('/sinup').post(usercontroll.sigup);
router.route('/checkemil').post(usercontroll.emailCheck);
router.route('/checknickname').post(usercontroll.nickNameCheck);
