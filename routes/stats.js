
// var Lesson = require("../models/lesson.js");
var async = require("async"),
    stats = require("../services/stats.js");

// GET /stats/overall/
exports.overall = function(req, res) {
    async.parallel([
        stats.totalStudents,
        stats.totalAdmins,
        stats.totalProjects,
        stats.totalLessons
    ], function(err, results) {
        console.log(arguments);
        res.json({
            students: results[0],
            admins:results[1],
            projects: results[2],
            lessons: results[3]
        });
    });
};
