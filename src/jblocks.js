var helpers = require('./helpers');
var Block = require('./Block');

/**
 * Block's declaration
 * @param  {Object} proto
 */
$.jblocks = function (proto) {
    if (!('name' in proto)) {
        throw new Error('Need to define block`s name');
    }
    if (helpers.decls[proto.name]) {
        throw new Error('Can`t redefine ' + proto.name + ' block');
    }
    helpers.decls[proto.name] = proto;
};

$.fn.jblocks = function (method) {
    var methods = {
        /**
         * Init all blocks inside
         */
        'init': function () {
            return this.find('[data-b]').jblocks('get');
        },
        /**
         * Destroy all blocks
         */
        'destroy': function () {
            this.find('[data-b]').jblocks('get').each(function () {
                this.destroy();
            });
        },
        /**
         * Returns block from cache or create it if doesn't exist
         * @return {Block} block
         */
        'get': function () {
            return this.map(function () {
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
        }
    };
    if (method in methods) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
        throw new Error('Can`t find method ' + method);
    }
};

// to get Block from global outspace
$.Block = Block;