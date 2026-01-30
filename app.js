if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate")
const path = require("path");
const methodOverride = require('method-override');
const port = 8080;
const MONGO_URL = process.env.ATLAS_URL;
const Expresserror = require("./utils/Expresserror.js");
const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users");



main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);

}

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method')); // Use query string for override

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERORR IN MONGO SESSION STORE", err)
});

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    res.locals.curruser = req.user;
    next();
});


// ab hamre sare route is ke base par kaam kar rahe hai kyun ki ham ab use kar rahe hai
//  router folder me likhe huye route ko jo require kiye hai "listings";
app.use("/listings", listingsrouter);
app.use("/privacy", listingsrouter);
app.use("/searching", listingsrouter);
app.use("/listings/:id/reviews", reviewsrouter); // abhi na is route ke path se id jo hai vo app.js ke pass hi rah jaa rahi hai 
app.use("/", userrouter);
// routes folder ke pass tak ja hi nahi rahi hai is ke liye router ka ak method ka use karenge 
// jab koi route ya path na mile tab ye call hoga use app review.js file me ja kar read karen
app.all('/*splat', (req, res, next) => {
    next(new Expresserror(404, "404 - Page not found"));

});

// this is Error middleware 
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went Wrong!" } = err;
    res.status(statuscode).render("error.ejs", { err, message });
});

app.listen(port, (req, res) => {
    console.log(`Server is running on this port${port}`);
})