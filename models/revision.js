var mongoose = require("../services/db.js").get();

var schema = mongoose.Schema({
    projectId: String,
    source: String,
    type: Number, // implicit save vs. explicit save
    errors: Array, // array of errors (if any)
    saved: {type: Date, default: Date.now}
});

var Revision = mongoose.model("Revision", schema);

Revision.TYPE = {
    IMPLICIT: 1,
    EXPLICIT: 2
};

Revision.schema.path("saved").validate(utils.validate.consts(Project.SAVED));

module.exports = Revision;
