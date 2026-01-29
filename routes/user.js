const express = require("express");
const router = express.Router({});
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// render signup form
// signup route
router.route("/signup")
    .get(userController.renderSignupform)
    .post(wrapasync(userController.registerform)
    );

// render login form
// login route
router.route("/login")
    .get(userController.renderloginform)
    .post(
        saveredirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
            successFlash: "welcome back!"
        }), userController.loginform
    );

// logout route
router.get("/logout", userController.longout);

module.exports = router;