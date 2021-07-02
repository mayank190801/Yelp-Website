const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Joi = require("joi");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const app = express();
const User = require("./models/user");

const session = require("express-session");
const flash = require("connect-flash");

const userRoutes = require("./routes/user");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");

const passport = require("passport");
const LocalStrategy = require("passport-local");

//-------------------------------------------------

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
	console.log("Database Connected!");
});

//-------------------------------------------------

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
	secret: "thisisreallystupidmyfirendl",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));
app.use(flash());

//-------------------------------------------------

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//-------------------------------------------------

//This is where we are setting local variables/flash variable!!!!
//pretty coool if you ask me!!
//couldn't have been able to do it on my own!!!
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/campground", campgroundRoutes);
app.use("/campground/:id/review", reviewRoutes);
app.use("/", userRoutes);

//Random homepage, never used yet

//-------------------------------------------------

app.get("/fake", async (req, res) => {
	const user = new User({ email: "mank@gmail.com", username: "mank" });
	const newUser = await User.register(user, "mankiii");
	res.send(newUser);
});

//-------------------------------------------------

app.get("/", (req, res) => {
	res.send("I AM THE HOMEPAGE");
});

//show all the details related to campground

///POST ROUTES FOR REVIEWS ARE BELOW

app.all("*", (req, res, next) => {
	next(new ExpressError("Not Found Dude!", 401));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Error";
	res.status(statusCode).render("error", { err });
});

//-------------------------------------------------

//listening on this port!!!
app.listen(3000, () => {
	console.log("Serving on port 3000!");
});
