// Models a user of the system (can be a mentor, pupil, etc.
// everyone is considered a user).

var mongoose = require("../services/db").get(),
    password = require("../services/util/password"),
    utils = require("../services/util/model.js");

var schema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    locale: String,
    joined: Date,
    country: String,      // ISO 2 Char (e.g. US, CA, CH)
    locality: String,     // aka city
    region: String,       // aka state
    postalCode: String    // aka zip
});

schema.methods.checkPassword = function(pass) {
    return password.check(pass, this.hash);
};

schema.pre("save", function(next) {
    if (this.isModified('password')) {
        this.password = password.hash(this.password);
    }
    next();
});

var User = mongoose.model("User", schema);

module.exports = User;
