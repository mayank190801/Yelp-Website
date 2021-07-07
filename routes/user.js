const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const users = require("../controller/users");

//first ever route for authentication and stuff
router.get("/register", users.renderRegister);

router.post("/register", catchAsync(users.createNewUser));

router.get("/login", users.renderLogin);

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	users.login
);

router.get("/logout", users.logout);

module.exports = router;
