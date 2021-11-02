const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const commRouter = require("./comment");
const lunchRouter = require("./lunchlist");
const userReview = require("./userreview");
const applicantRouter = require("./applicant");
const authRouter = require("./auth");
router.use("/", [userRouter]);
router.use("/comment", [commRouter]);
router.use("/lunchpost", [lunchRouter]);
router.use("/spoon", [userReview]);
router.use("/applicant", [applicantRouter]);
router.use("/auth", [authRouter]);

module.exports = router;
