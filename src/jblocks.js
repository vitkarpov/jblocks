var helpers = require('./helpers');
var Block = require('./Block');

/**
 * Block's declaration
 * @param  {String} name
 * @param  {Object} proto
 */
$.define = function(name, proto) {
    if (helpers.decls[name]) {
        throw new Error('Can`t redefine ' + name + ' block');
    }
    helpers.decls[name] = proto;
};

/**
 * Returns block from cache or create it if doesn't exist
 * @return {Block} block
 */
$.fn.getBlocks = function() {
    return this.map(function() {
        var $b = $(this);
        var bid = $b.data('_bid');

        if (bid) {
            return helpers.cache[bid];
        }

        var block = new Block($b);
        bid = block._id;

        $b.data('_bid', bid);
        helpers.cache[bid] = block;

        return block;
    });
};

/**
 * Init all blocks inside
 */
$.fn.initBlocks = function() {
    return this.find('[data-b]').getBlocks();
};

/**
 * Destroy all blocks
 */
$.fn.destroyBlocks = function() {
    this.find('[data-b]').getBlocks().each(function() {
        this.destroy();
    });
};

// to get Block from global outspace
$.Block = Block;
