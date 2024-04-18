const reviewsRouter = require("express").Router();
const ReviewsController = require("../controller/reviews");
const authCheck = require("../middleware/middleware");

reviewsRouter.post("/create", authCheck.jwtToken, ReviewsController.createNewReview);
reviewsRouter.post("/update", authCheck.jwtToken, ReviewsController.updateFileReview);
reviewsRouter.get("/list", authCheck.jwtToken, ReviewsController.getReviewListForFileId);
reviewsRouter.get("/delete", authCheck.jwtToken, ReviewsController.deleteReview);

module.exports = reviewsRouter;