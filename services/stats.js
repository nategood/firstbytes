// Really poor generic name (stats) for now.

var User = require('../../models/user'),
    Project = require('../../models/project'),
    Lesson = require('../../models/lesson');

// @param {function} callback (string err, int count)
exports.totalStudents = function(callback) {
    User.count({acl: 0}, callback);
};

// @param {function} callback (string err, int count)
exports.totalProjects = function(callback) {
    Project.count({}, callback); // need to back out projects by admins, not as easy with Mongo/NoSQL
};
