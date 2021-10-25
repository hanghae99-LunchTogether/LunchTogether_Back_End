const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const commRouter = require("./comment");
const lunchRouter = require("./lunchlist");
router.use("/", [userRouter]);
router.use("/comment", [commRouter]);
router.use("/lunchpost", [lunchRouter]);

module.exports = router;
