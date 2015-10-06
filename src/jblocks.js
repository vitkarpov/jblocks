var helpers = require('./helpers');
var Block = require('./Block');

var methods = {
    staticMethods: {
        /**
         * Block's declaration
         * @param  {Object} proto
         */
        'define': function (proto) {
            if (!('name' in proto)) {
                throw new Error('Need define block name');
            }
            if (helpers.decls[proto.name]) {
                throw new Error('Can`t redefine ' + proto.name + ' block');
            }
            helpers.decls[proto.name] = proto;
        }
    },
    selectorMethods: {
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
    }
}

function initMethod(self, type, args) {
    args = Array.prototype.slice.call(args, 0);
    var method = args.splice(0, 1);
    if (method in methods[type]) {
        return methods[type][method].apply(self, args);
    } else {
        throw new Error('Can`t find method ' + method);
    }
};


$.jblocks = function () {
    return initMethod(this, 'staticMethods', arguments);
}

$.fn.jblocks = function () {
    return initMethod(this, 'selectorMethods', arguments);
}


// to get Block from global outspace
$.Block = Block;