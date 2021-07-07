const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const { campgroundSchema, reviewSchema } = require("../schemas");
const camp = require("../controller/campgrounds");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

//validation middleware

//all the routes
router.get("/", catchAsync(camp.index));

//Go to a new from to create a new comment
router.get("/new", isLoggedIn, camp.newRenderForm);

//Go in details infromation regarding the campground
router.get("/:id", catchAsync(camp.getCampgroundDetails));

//Add new comment using post request and go back to home page
router.post(
	"/",
	isLoggedIn,
	upload.array("image"),
	validateCampground,
	catchAsync(camp.newCampground)
);

//upload.single("file"),
// router.post("/", upload.array("image"), (req, res) => {
// 	console.log(req.files);
// 	res.send("This worked");
// });

//this section is what now i will build in order to improve my skills
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(camp.editRenderForm));

//for updating a selected campground
router.patch(
	"/:id",
	isLoggedIn,
	isAuthor,
	upload.array("image"),
	validateCampground,
	catchAsync(camp.updateCampground)
);

//deleting a selected campground
//should be simple enough
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(camp.deleteCampground));

module.exports = router;
