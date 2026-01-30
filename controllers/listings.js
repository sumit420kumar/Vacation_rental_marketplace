require("dotenv").config();
const opencage = require('opencage-api-client');
const Listing = require("../models/listing.js");
const { options } = require("joi");
// const apiKey = 'e8c5a337f4ff4b319f1c448d92b501e6';
// const axios = require('axios');

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};


module.exports.search = async (req, res) => {
    try {
        // console.log(req.query);   for check what is come in query
        const usersearch = req.query.q || req.query.search;
        let filter = {};
        if (usersearch) {
            filter = {
                $or: [
                    { country: { $regex: usersearch, $options: "i" } },
                    { title: { $regex: usersearch, $options: "i" } },
                    { location: { $regex: usersearch, $options: "i" } }
                ]
            };
            const allListings = await Listing.find(filter)
            // console.log(allListings)
            res.render("listings/search.ejs", { allListings });
        } else {
            req.flash("error", "Please provide at least one search criteria.");
            return res.send("not found");
        }
    } catch (err) {
        return res.error(`error${err}`);
    }
};
module.exports.privacy = async (req, res) => {
    res.render("listings/privacy.ejs");

};



module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");;
    if (!listing) {
        req.flash("error", "Cannot find that listing or listing you requesting is not available");
        return res.redirect("/listings");
    };

    // console.log(listing.owner.username);
    res.render("listings/show.ejs", { listing });

};

module.exports.createListing = async (req, res) => {
    try {
        const response = opencage.geocode({ q: req.body.listing.location, limit: 1, key: process.env.OPENMAPS_API_KEY })
        var data = await response;
        // console.log(data.results[0].geometry.lng, data.results[0].geometry.lat);
    } catch (error) {
        console.log('Error:', error.message);
    }

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    // newlisting.geometry = {
    //     type: "Point",
    //     coordinates: [data.results[0].geometry.lng, data.results[0].geometry.lat]
    // }
    if (data && data.results && data.results[0]?.geometry) {
        newlisting.geometry = {
            type: 'Point',  // Required field
            coordinates: [data.results[0].geometry.lng, data.results[0].geometry.lat]  // Numbers only, lng first
        };
    } else {
        // Handle no coords: throw error or set default
        throw new Error('Invalid geocoding data');
    }

    await newlisting.save();
    // console.log(savedListing);
    req.flash("success", "Successfully added ");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing or listing you requesting is not available");
        return res.redirect("/listings");
    };
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload", "/upload/w_150,,c_fill/");
    res.render("listings/edit.ejs", { listing, originalimageurl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Successfully updated")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletelist = await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success", "Successfully deleted listing");
    res.redirect("/listings");

};