import * as express from "express";
const router = express.Router();

import userRouter from "./user";
import commRouter from "./comment";
import lunchRouter from "./lunchlist";
import userReview from "./userreview";
import applicantRouter from "./applicant";
import bookRouter from "./bookmark";
import soket from "./soket";
import offer from "./offer";
import passport from "./passportlog";

router.use("/", [userRouter, passport]);
router.use("/comment", [commRouter]);
router.use("/lunchpost", [lunchRouter]);
router.use("/spoon", [userReview]);
router.use("/applicant", [applicantRouter]);
router.use("/book", [bookRouter]);
router.use("/offer", [offer]);
router.use("/test", [soket]);

export default router;
