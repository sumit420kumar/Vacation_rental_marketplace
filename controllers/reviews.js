const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.CreateReview = async (req, res, next) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "Successfully added review");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.DestroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted review");
    res.redirect(`/listings/${id}`);
};