const express = require("express");
const router = express.Router();
// const expressError = require("../utils/expressError.js");
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isowner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
// index route 
// //add new listing route create route

router
    .route("/")
    .get(wrapasync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validatelisting,
        wrapasync(listingController.createListing)
    );

//search route
router.get("/query", wrapasync(listingController.search));

// privacy route
router.get("/safe", wrapasync(listingController.privacy));

// add new route        
router.get("/new", isLoggedIn, listingController.renderNewForm);

// save edite or update route
//  open edit route
router
    .route("/:id/edit")
    .get(isLoggedIn, isowner, wrapasync(listingController.renderEditForm))
    .put(isLoggedIn, isowner, upload.single("listing[image]"), validatelisting,
        wrapasync(listingController.updateListing)
    );

// show and delete route    
router.route("/:id")
    .get(wrapasync(listingController.showListings))
    .delete(isLoggedIn, isowner, wrapasync(listingController.destroyListing));




module.exports = router;