const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const commRouter = require("./comment");
const lunchRouter = require("./lunchlist");
const userReview = require("./userreview");
const applicantRouter = require("./applicant");
const bookRouter = require("./bookmark");
const soket = require("./soket");
const offer = require("./offer");
const passport = require("./passportlog")
router.use("/", [userRouter,passport]);
router.use("/comment", [commRouter]);
router.use("/lunchpost", [lunchRouter]);
router.use("/spoon", [userReview]);
router.use("/applicant", [applicantRouter]);
router.use("/book", [bookRouter]);
router.use("/offer",[offer]);
router.use("/test",[soket])
  
module.exports = router;
