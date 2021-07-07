const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
	res.render("users/register");
};

module.exports.createNewUser = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
	res.render("users/login");
};

module.exports.login = (req, res) => {
	req.flash("success", "Welcome Back!");
	//this shit is creating a lot of errors
	const returnUrl = req.session.returnTo || "/campground";
	console.log(returnUrl);
	delete req.session.returnTo;
	res.redirect(returnUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/campground");
};
