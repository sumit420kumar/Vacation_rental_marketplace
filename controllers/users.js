const user = require("../models/users.js")

module.exports.renderSignupform = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderloginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.registerform = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new user({ email, username });
        const registereduser = await user.register(newuser, password);
        // console.log(registereduser);
        req.login(registereduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to Wanderlust");
            res.redirect("/listings");
        });

    }
    catch (e) {
        req.flash("error", e.message);
        // console.log(e.message);
        res.redirect("/signup");
    }

};

// This is not for login this for render page after login
// passport handle login process
module.exports.loginform = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are Logged In");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

module.exports.longout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been Logout Successfully");
        res.redirect("/listings");
    })
};