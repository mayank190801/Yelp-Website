const Joi = require("joi");

const campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
		price: Joi.number().required().min(0),
		img: Joi.string().required(),
	}).required(),
});

const reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().min(1).max(5).required(),
		body: Joi.string().required(),
	}).required(),
});

module.exports = campgroundSchema;
module.exports = reviewSchema;
