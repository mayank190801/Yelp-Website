const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
};

module.exports.newRenderForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.getCampgroundDetails = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");

	if (!campground) {
		req.flash("error", "ERROROROROR, Not found the campground");
		return res.redirect("/campground");
	}
	// console.log(campground);
	res.render("campgrounds/show", { campground });
};

module.exports.newCampground = async (req, res, next) => {
	const newCamp = new Campground(req.body.campground);
	newCamp.img = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	newCamp.author = req.user._id;
	await newCamp.save();
	console.log(newCamp);
	req.flash("success", "campground succesfully made");
	res.redirect(`/campground/${newCamp._id}`);
};

module.exports.editRenderForm = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
	const updateCamp = await Campground.findByIdAndUpdate(
		req.params.id,
		req.body.campground
	);
	const imgs = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	updateCamp.img.push(...imgs);
	await updateCamp.save();

	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await updateCamp.updateOne({
			$pull: { img: { filename: { $in: req.body.deleteImages } } },
		});
	}

	req.flash("success", "campground succesfully updated");
	res.redirect(`/campground/${req.params.id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
	const deletedCamp = await Campground.findByIdAndDelete(req.params.id);
	req.flash("success", "campground succesfully DELETED");
	res.redirect("/campground");
};
