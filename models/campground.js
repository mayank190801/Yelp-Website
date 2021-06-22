const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
    title: String,
    description :String,
    img : String,
    price: Number,
    location : String
});

//So this is how you export your mongoose model!!!
module.exports = mongoose.model('Campground', CampgroundSchema)