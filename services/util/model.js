var _ = require("lodash");
module.exports = {
    validate: {
        /**
         * @param consts {Object} dictionary mapping const name to value
         * @return {Function} validate function for use with mongoose
         */
        consts: function(consts) {
            var vals = _.values(consts);
            return function(value) {
                return vals.indexOf(value) !== -1;
            };
        }
    }
};
