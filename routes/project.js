/**
 * Routes for "projects"
 *
 * Need to add in the revisions layer when we're ready.
 * Need to add in auth middleware :-)
 */
var Project = require("../models/project.js");

// GET /project/ID/
exports.get = function(req, res){
    // Project.find();
    res.send("json", {"a": "b"});
};

// PUT /project/ID/
exports.put = function(req, res){
    // todo dry flow this up across routers
    Project.findOne({ _id: req.params.id }, function(err, p) {
        if (err) req.send(500, {"error": "We got trouble in River City"});
        if (!p) req.send(404, {"error": "Who?"});
        // todo validation, etc.
        p.name = req.body["name"];
        p.source = req.body["source"];
        p.save();
        // todo
        res.send("json", p);
    });
};

// POST /project/
exports.post = function(req, res){
    // todo validation, authentication, etc.
    var p = new Project({
        name: req.body["name"],
        source: req.body["source"],
        created: new Date()
        // userId: todo
    });
    p.save();
    res.send("json", p);
};

// DELETE /project/ID/
exports.delete = function(req, res){
    res.send("json", {"a": "b"});
};
