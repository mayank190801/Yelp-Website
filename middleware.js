module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		//so that it remember where it came from!!!!
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be logged In");
		return res.redirect("/login");
	}
	next();
};
