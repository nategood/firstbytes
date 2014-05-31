/**
 * Manages a Coder's Projects
 * Creating them, editing them, making revisions, seeing diffs, etc.
 */

/**
 * @param {Project|String} project Project or id of a project
 */
var ProjectManager = function(project) {
    if (typeof project === 'object') {
        this.id = project._id;
        this.project = project;
    } else {
        this.id = project;
        this.project = null;
    }
};

/**
 * @param {Function} callback (err, Project)
 * @param {Boolean} force force another lookup, even if we've already cached
 */
ProjectManager.prototype.fetch = function(callback, force) {
    if (this.project && force !== true) callback(null, this.project);
    Project.findOne({ _id: this.id }, function(err, project) {
        if (!err && project) this.project = project;
        callback(err, project);
    });
};

/**
 * @param {Object} details = {
 *     type: see Revision.TYPE_*
 *     source: string of source code
 *     saved: optional Date instance, defaults to now
 *     errors: array of errors with this revision
 * };
 * @param {Function} callback (err, Revision)
 */
ProjectManager.prototype.addRevision = function(details, callback) {
    this.fetch(function(err, project) {
        if (err) return callback(err);
        if (!project) return callback(null);

        var rev = new Revision({
            type: req.body.type == Revision.TYPE_EXPLICIT ? Revision.TYPE_EXPLICIT : Revision.TYPE_IMPLICIT,
            source: req.body.source,
            saved: details.saved ? details.saved : Date.now(),
            errors: [] // parse source server side check for errors
        });

        // no transactions :-(
        project.save(function (err) {
            if (err) callback(err);
            revision.save(function(err) {
                if (err) callback(err);
                callback(null, revision);
            });
        });
    });
};

/**
 * Gets the last 10 explicit revisions
 * @todo add options for changing limit and type (implicit vs. explicit)
 *
 * @param {Function} callback (err, Revision)
 */
ProjectManager.prototype.getRevisions = function(callback) {
    this.fetch(function(err, project) {
        // We still verify that the project exists
        if (err) return callback(err);
        if (!project) return callback(null);

        // todo add some sort of paging
        Revision.find({projectId: this.id}, callback);
    });
};

exports = ProjectManager;