const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const Review = require("../models/review");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { campgroundSchema, reviewSchema } = require("../schemas");

//validation middleware
const validateCampground = (req, res, next) => {
	//Prettty smoothhhhh
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

//all the routes
router.get(
	"/",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

//Go to a new from to create a new comment
router.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

//Go in details infromation regarding the campground
router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate("reviews");
		//Important use of flash error!!!!
		//Pretty cool if you ask me!
		if (!campground) {
			req.flash("error", "ERROROROROR, Not found the campground");
			return res.redirect("/campground");
		}
		// console.log(campground);
		res.render("campgrounds/show", { campground });
	})
);

//Add new comment using post request and go back to home page
router.post(
	"/",
	validateCampground,
	catchAsync(async (req, res, next) => {
		const newCamp = new Campground(req.body.campground);
		await newCamp.save();
		req.flash("success", "campground succesfully made");
		res.redirect(`/campground/${newCamp._id}`);
	})
);

//this section is what now i will build in order to improve my skills
router.get(
	"/:id/edit",
	catchAsync(async (req, res) => {
		//we will take id from here, get the element and parse its info in edit
		const campground = await Campground.findById(req.params.id);
		res.render("campgrounds/edit", { campground });
	})
);

//for updating a selected campground
router.patch(
	"/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const updateCamp = await Campground.findByIdAndUpdate(
			req.params.id,
			req.body.campground
		);
		req.flash("success", "campground succesfully updated");
		res.redirect(`/campground/${req.params.id}`);
	})
);

//deleting a selected campground
//should be simple enough
router.delete(
	"/:id",
	catchAsync(async (req, res, next) => {
		const deletedCamp = await Campground.findByIdAndDelete(req.params.id);
		req.flash("success", "campground succesfully DELETED");
		res.redirect("/campground");
	})
);

module.exports = router;
