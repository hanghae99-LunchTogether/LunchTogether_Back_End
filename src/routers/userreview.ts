import * as express from "express";
const router = express.Router();
import middleware from "../middlewares/authMiddleware";
import userReviewController from "../controller/userreview";

router.route("/").post(middleware, userReviewController.spoonpost);
router.route("/:userid").get(userReviewController.spoonget);

export default router;
