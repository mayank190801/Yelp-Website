const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

//first ever route for authentication and stuff
router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (err) => {
				if (err) return next(err);
				req.flash("success", "Welcome to Yelp Camp");
				res.redirect("/campground");
			});
		} catch (e) {
			req.flash("error", e.message);
			res.redirect("/register");
		}
	})
);

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	(req, res) => {
		req.flash("success", "Welcome Back!");
		const returnUrl = req.session.returnTo || "/campground";
		delete req.session.returnTo;
		res.redirect(returnUrl);
	}
);

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/campground");
});

module.exports = router;
