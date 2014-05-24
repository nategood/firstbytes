/**
 * Routes for "projects"
 *
 * Need to add in the revisions layer when we're ready.
 * Need to add in auth middleware :-)
 */
var Project = require("../models/project.js");
console.log("LDKFJLADKJSLFKJSLK");
console.log(Project);

// GET /project/ID/
exports.get = function(req, res){
    // Project.find();
    res.send("json", {"a": "b"});
};

// PUT /project/ID/
exports.put = function(req, res){
    // todo validation, authentication, etc.
    // var p = new Project({
    //     "name": req.body["name"],
    //     "src": req.body["src"],
    //     "created": new Date()
    //     // "user_id": todo
    // });
    // p.save();
    // res.send("json", p); // JSON.stringify
};

// POST /project/
exports.post = function(req, res){
    // todo validation, authentication, etc.
    var p = new Project({
        "name": req.body["name"],
        "src": req.body["src"],
        "created": new Date()
        // "user_id": todo
    });
    p.save();
    res.send("json", p); // JSON.stringify
};

// DELETE /project/ID/
exports.delete = function(req, res){
    res.send("json", {"a": "b"});
};
