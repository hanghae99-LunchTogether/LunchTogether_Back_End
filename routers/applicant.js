const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/authMiddleware");
const {
  applicantpost,
  applicantdelete,
  applicantget,
} = require("../controller/applicant");

router
  .route("/:lunchid")
  .get(applicantget)
  .post(middleware, applicantpost)
  .delete(middleware, applicantdelete);

module.exports = router;
