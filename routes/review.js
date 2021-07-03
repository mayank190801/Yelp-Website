const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../schemas");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		console.log(req.params.id);
		const camp = await Campground.findById(req.params.id);
		const review = await new Review(req.body.review);

		review.author = req.user._id;

		camp.reviews.push(review);
		await camp.save();
		await review.save();

		req.flash("success", "review succesfully made");
		res.redirect(`/campground/${camp._id}`);
	})
);

//Delete review
router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Review succesfully delete");
		res.redirect(`/campground/${id}`);
	})
);

module.exports = router;
