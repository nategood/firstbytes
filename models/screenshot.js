var mongoose = require('../services/db.js').get();
var utils = require('../services/util/model.js');

var schema = mongoose.Schema({
    name: String,
    created: {type: Date, default: Date.now},
    userId: String,
    projectId: String,
    data: {type: String, required: true}
});

var editable = ['name', 'userId', 'projectId', 'data', '_id'];
schema.methods.getEditable = function() { return editable; };
schema.methods.toResponse = utils.toResponse(editable);

var Screenshot = mongoose.model('Screenshot', schema);

module.exports = Screenshot;
