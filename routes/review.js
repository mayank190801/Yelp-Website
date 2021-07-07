const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../schemas");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controller/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.newAnswer));

//Delete review
router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.deleteAnswer)
);

module.exports = router;
