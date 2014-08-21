/**
 * Manages a Coder's Projects
 * Creating them, editing them, making revisions, seeing diffs, etc.
 */

 var Project = require("../../models/project");
 var Revision = require("../../models/revision");

/**
 * @param {Project|String} project Project or id of a project
 */
var ProjectManager = function() {};

/**
 * @param {int|Project}
 * @param {Function} callback (err, Project)
 */
ProjectManager.prototype.fetch = function(project, callback) {
    if (typeof project === 'object') return callback(null, project);
    Project.findOne({ _id: this.id }, function(err, project) {
        callback(err, project);
    });
};

/**
 * @param {Project} project
 * @param {int|Object} type save type or object of optional details (source, type, saved)
 * @param {Function} callback (err, Revision)
 */
ProjectManager.prototype.saveRevision = function(project, details, callback) {
    if (typeof details === 'function') {
        callback = details;
        details = {};
    }
    if (typeof details === 'number') details = {type: details};
    if (typeof details !== 'object') details = {};

    // revisions should eventually be stored as a reference to a git hash as opposed to the source itself
    var rev = new Revision({
        type: details.type === Revision.TYPE.EXPLICIT ? Revision.TYPE.EXPLICIT : Revision.TYPE.IMPLICIT,
        source: details.source || project.source,
        saved: details.saved || Date.now(),
        err: [] // TODO parse source server side check for errors via jshint
    });

    rev.save(callback);
};

/**
 * Gets the last 10 explicit revisions
 * @todo add options for changing limit and type (implicit vs. explicit)
 *
 * @param Project
 * @param {Function} callback (err, Revision[])
 */
ProjectManager.prototype.getRevisions = function(project, callback) {
    Revision.find({projectId: this.id}, callback); // todo add some sort of paging
};

/**
 * /project/id/revisions
 * @param {Project}
 * @param {Function} callback (err, Project)
 * @return {Object} object ready to be sent to the client as a restful response
 */
ProjectManager.prototype.resourceProject = function(project, callback) {
    // todo build a helper for these and perhaps move these formatters
    // into another service
    return {
        name: project.name,
        source: project.source,
        created: project.created, // to timestamp?
        state: project.state,
        privacy: project.privacy,
        rels: { // todo complete URIs
            revisions: '/project/' + project._id + '/revisions',
            user: '/user/' + project.userId,
        }
    };
};

/**
 * /project/id/revisions
 * @param {roject}
 * @param {Function} callback (err, Project)
 * @return {Object} object ready to be sent to the client as a restful response
 */
ProjectManager.prototype.resourceRevisions = function(project, callback) {
    this.getRevisions(project, function(err, revisions) {
        if (err) return callback(err);
        if (revisions === null) return callback(new Error('Unknown project'));
        var res = revisions.map(function(revision) {
            return {
                source: revision.source,
                type: revision.type,
                rels: { // todo complete URIs
                    revisions: '/project/' + project._id,
                    user: '/user/' + project.userId
                }
            };
        });
    });
};

module.exports = ProjectManager;