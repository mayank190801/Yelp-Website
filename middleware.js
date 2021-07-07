const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		//so that it remember where it came from!!!!
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be logged In");
		return res.redirect("/login");
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	//Prettty smoothhhhh
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		// res.redirect(`/questions/${id}`);'
		// console.log("wtf");
		return res.redirect(`/campground/${id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	// console.log("this takes place");
	const { id, reviewId } = req.params;
	// console.log(id);
	// console.log("this takes placesdfsfsd");

	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campground/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	// console.log(reviewSchema);
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
