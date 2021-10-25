const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const commRouter = require("./comment");
router.use("/", [userRouter]);
router.use("/comment", [commRouter]);

module.exports = router;
