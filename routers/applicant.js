const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/authMiddleware");
const {
  applicantpost,
  applicantdelete,
  applicantget,
  applicantconfirmed,
  applicantgetme,
  applicantgetthor
} = require("../controller/applicant");

router
  .route("/:lunchid")
  .get(applicantget)
  .post(middleware, applicantpost)
  .delete(middleware, applicantdelete)
  .patch(middleware, applicantconfirmed);
  
router.route("").get(middleware, applicantgetme)
router.route('/user/:userid').get(applicantgetthor);
module.exports = router;
