var id = 0;

exports.cache = {};
exports.decls = {};

/**
 * Returns unique id
 */
exports.guid = function() {
    return 'b-' + id++;
};
