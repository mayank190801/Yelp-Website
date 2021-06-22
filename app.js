const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const app = express();

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

//Random homepage, never used yet
app.get('/', (req, res) =>{
    res.send("I AM THE HOMEPAGE");
})

//show all the details related to campground
app.get('/campground' , async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

//Go to a new from to create a new comment
app.get('/campground/new', (req, res) =>{
    res.render('campgrounds/new');
})

//Go in details infromation regarding the campground
app.get('/campground/:id', async(req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show' ,{campground}); 
})

//Add new comment using post request and go back to home page
app.post('/campground', async(req, res) =>{

    const newCamp =  new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campground/${newCamp._id}`);
})

//this section is what now i will build in order to improve my skills
app.get('/campground/:id/edit' , async (req, res) =>{
    //we will take id from here, get the element and parse its info in edit 
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
})

//for updating a selected campground
app.patch('/campground/:id' , async(req, res) =>{
    const updateCamp = await Campground.findByIdAndUpdate(req.params.id , req.body.campground);
    res.redirect(`/campground/${req.params.id}`);
})

//deleting a selected campground
//should be simple enough 
app.delete('/campground/:id', async(req, res) =>{
    const deletedCamp = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campground')
})

//listening on this port!!!
app.listen(3000, () =>{
    console.log("Serving on port 3000!");
}) 