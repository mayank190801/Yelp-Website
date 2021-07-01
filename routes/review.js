const express = require("express");
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { campgroundSchema, reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
	// console.log(reviewSchema);
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

router.post(
	"/",
	validateReview,
	catchAsync(async (req, res) => {
		console.log(req.params.id);
		const camp = await Campground.findById(req.params.id);
		const review = await new Review(req.body.review);
		// console.log(camp);
		// console.log(review);

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
