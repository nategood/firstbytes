// screenshots
var Screenshot = require("../models/screenshot.js");
var auth = require("../services/auth/user-auth.js");

var L = {
    UNABLE_TO_SAVE: "Unabled to save"
};

// GET /screenshot/:id/
exports.get = function(req, res) {
    auth.getUserFromRequest(req, function(err, user) {
        Screenshot.findById(req.params.id, function(err, screenshot) {
            res.json(screenshot);
        });
    });
};

// POST /screenshot/
exports.create = function(req, res) {
    var s = new Screenshot(req.body);
    auth.getUserFromRequest(req, function(err, user) {
        s.userId = user._id;
        s.save(function(err) {
            if (err) return res.status(400).json({error: L.UNABLE_TO_SAVE});
            res.json(s.toResponse());
        });
    });
};
