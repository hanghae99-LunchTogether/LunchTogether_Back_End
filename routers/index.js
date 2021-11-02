const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const commRouter = require("./comment");
const lunchRouter = require("./lunchlist");
const userReview = require("./userreview");
const applicantRouter = require("./applicant");
router.use("/", [userRouter]);
router.use("/comment", [commRouter]);
router.use("/lunchpost", [lunchRouter]);
router.use("/spoon", [userReview]);
router.use("/applicant", [applicantRouter]);


const testRouter = require("./mykakakodo")
router.use("/test",[testRouter])

module.exports = router;
