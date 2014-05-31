/**
 * Routes for "projects"
 *
 * Need to add in the revisions layer when we're ready.
 * Need to add in auth middleware :-)
 * Need to add in validation
 * Need to DRY up some of these methods across other model routes
 */
var Project = require("../models/project.js");
var modelRoute = require("../routes/_model.js");

// GET /project/ID/
exports.get = modelRoute.get(Project);

// PUT /project/ID/
exports.put = modelRoute.put(Project);

// POST /project/
exports.post = modelRoute.post(Project, function(req, res, instance) {
    instance.created = Date.now(); // force it for now at least
});

// DELETE /project/ID/
exports.delete = modelRoute.delete(Project);

// POST /project/ID/revisions/
exports.saveRevision = function(req, res) {
    var pm = new ProjectManager(req.params.id);
    req.body.saved = Date.now(); // force it for now at least
    pm.addRevision(req.body, function(err, revision) {
        if (err) return res.json(500, {"error": err});
        if (!revision) return res.json(404, {"error": "Who?"});
        res.json(revision);
    });
};

// GET /project/ID/revisions/
exports.getRevisions = function(req, res) {
    var pm = new ProjectManager(req.params.id);
    pm.getRevisions(req.body, function(err, revisions) {
        if (err) return res.json(500, {"error": err});
        if (!revisions) return res.json(404, {"error": "Who?"}); // project didn't exist
        res.json(revisions); // may also be an empty array
    });
};