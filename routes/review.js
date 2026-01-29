const express = require("express");
const router = express.Router({ mergeParams: true }); // jo aap ko app.js me method bataya tha vo is method ko require karte samay use karnge aur true set kar denge
const review = require("../models/review.js");
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js")
const { validatereview, isLoggedIn, isreviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//reviews submit route 
//post route
router.post("/", isLoggedIn, validatereview, wrapasync(reviewController.CreateReview));
// Delete review route 
router.delete(
    "/:reviewId", isLoggedIn, isreviewAuthor,
    wrapasync(reviewController.DestroyReview)
);

module.exports = router;