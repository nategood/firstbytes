// user.js
var mongoose = require("mongoose");

// Models a user of the system (can be a mentor, pupil, etc.
// everyone is considered a user).

var schema = mongoose.Schema({
    "name": String,
    "joined": Date,
    "country": String,      // ISO 2 Char (e.g. US, CA, CH)
    "locality": String,     // aka city
    "region": String,       // aka state
    "postalCode": String,   // aka zip

    // social tokens?
});

// todo add instance methods (but don't make fat models)

var User = mongoose.Model("User", schema);

exports.User = User;
