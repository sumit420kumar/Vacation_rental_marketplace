const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
// delete require.cache[require.resolve('your-plugin-name')];

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true,
    }
});
// Correct plugin = FUNCTION

userSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model("users", userSchema);