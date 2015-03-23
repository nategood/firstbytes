// Really poor generic name (stats) for now.

var User = require('../models/user'),
    Project = require('../models/project'),
    Lesson = require('../models/lesson');

// @param {function} callback (string err, int count)
exports.totalStudents = function(callback) {
    User.count({acl: 0}, callback); // exclude everyone that isn't a "student"
};

// @param {function} callback (string err, int count)
exports.totalAdmins = function(callback) {
    User.count({acl: {$ne: 0}}, callback);
};

// @param {function} callback (string err, int count)
exports.totalProjects = function(callback) {
    Project.count({}, callback);
};

// @param {function} callback (string err, int count)
exports.totalLessons = function(callback) {
    Lesson.count({}, callback);
};

// @param {string} id
// @param {function} callback
exports.userDetails = function(id, callback) {
    User.findOne({_id: id}, function(err, user) {
        if (err) return callback(err);
        Project.find({userId: user._id}, function(err, projects) {
            if (err) return callback(err);
            // projects.map(function(p) { return p.toResponse(); } )
            callback(null, {
                user: user,
                projects: projects
            });
        });
    });
};

// @param {function} callback
exports.allStudents = function(callback) {
    // todo add paging
    User.find({acl: 0}, callback);
};

// @param {function} callback
exports.allAdmins = function(callback) {
    User.find({acl: {$ne: 0}}, callback);
};

// @param {string} id
// @param {object} options optional
// @param {function} callback
// exports.searchUser = function(phrase, options, callback) {
//     if (typeof options === 'function') {
//         callback = options;
//         options = null;
//     }
//     if (typeof options !== 'object') options = {};
//     User.find({name: });
// };
