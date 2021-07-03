const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title: String,
	description: String,
	price: Number,
	img: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
	if (campground.reviews.length) {
		const res = await review.deleteMany({
			_id: { $in: campground.reviews },
		});
		console.log(res);
	}
});

//So this is how you export your mongoose model!!!
module.exports = mongoose.model("Campground", CampgroundSchema);
