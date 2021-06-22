const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const app = express();

const arr = ["Ram nagar", "Kanta Bai", "Delhi", "Lucknow", "Kanpur"];

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () =>{
    console.log("Database Connected!"); 
})

const seed = async () =>{
    for(let i = 0 ;i < arr.length ;i++){
        let title = arr[i];
        let description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo eaque quidem id porro maiores quas. Dolore repellat explicabo alias, blanditiis aliquid porro similique repudiandae, voluptates quasi quod, ad cum vero! Ipsam molestias quos, fugit alias beatae nesciunt architecto blanditiis, modi repellendus velit quidem magni cum voluptates! Quasi atque modi in porro, fugiat alias? Temporibus minima quod voluptates culpa, perspiciatis eius. Vel, iusto molestias eligendi tenetur autem asperiores error necessitatibus voluptatem quisquam. Laboriosam cupiditate commodi fuga saepe enim et perspiciatis tempora sequi alias. Saepe nobis minus incidunt reprehenderit id eum dolor.';
        let price = Math.floor(Math.random()*100);
        let img = "https://source.unsplash.com/collection/483251";
        const newCamp = new Campground({title, description,img, price});
        await newCamp.save();
    }
}

seed();

