const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.newAnswer = async (req, res) => {
	console.log(req.params.id);
	const camp = await Campground.findById(req.params.id);
	const review = await new Review(req.body.review);

	review.author = req.user._id;

	camp.reviews.push(review);
	await camp.save();
	await review.save();

	req.flash("success", "review succesfully made");
	res.redirect(`/campground/${camp._id}`);
};

module.exports.deleteAnswer = async (req, res) => {
	const { id, reviewId } = req.params;
	await Campground.findByIdAndUpdate(id, {
		$pull: { reviews: reviewId },
	});
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Review succesfully delete");
	res.redirect(`/campground/${id}`);
};
