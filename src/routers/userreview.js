const express = require("express");
const router = express.Router();
const middleware = require('../middlewares/authMiddleware')
const { spoonget , spoonpost} = require("../controller/userreview");

router.route('/').post(middleware,spoonpost)
router.route('/:userid').get(spoonget);


module.exports = router;
