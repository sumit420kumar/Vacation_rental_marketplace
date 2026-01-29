const { types, defaults } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewschema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    craetedat: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "users",
    }
});

module.exports = mongoose.model("review", reviewschema);
//