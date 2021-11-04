const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/authMiddleware");
const {
  applicantpost,
  applicantdelete,
  applicantget,
  applicantapproved,
  applicantconfirmed,
  applicantgetme
} = require("../controller/applicant");

router
  .route("/:lunchid")
  .get(applicantget)
  .post(middleware, applicantpost)
  .delete(middleware, applicantdelete);
  
router.route("/approved/:lunchid").patch(middleware, applicantapproved)
router.route("/confirmed/:lunchid").patch(middleware, applicantconfirmed)
router.route("").get(middleware, applicantgetme)
module.exports = router;
