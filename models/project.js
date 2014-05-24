// project.js
var mongoose = require("../services/db.js").get();

// Project models a new project that the Coder is working on
// For now it includes the source code, but this will soon change
// to use version control or perhaps GridFS to store revisions

// todo add instance methods (but don't make fat models)

// only inline temporarily, will soon change
var schema = mongoose.Schema({
    name: String,
    created: Date,
    source: String,
    userId: Number
});
var Project = mongoose.model('Project', schema);

module.exports = Project;