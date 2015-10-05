var helpers = require('./helpers');
var Block = require('./Block');

$.fn.jblocks = function(method){
    var self = this;
    var methods = {
        /**
         * Init all blocks inside
         */
        'init': function(){
            return this.find('[data-b]').jblocks('list');
        },
        /**
         * Destroy all blocks
         */
        'destroy': function(){
            this.find('[data-b]').jblocks('list').each(function() {
                this.destroy();
            });
        },
        /**
         * Returns block from cache or create it if doesn't exist
         * @return {Block} block
         */
        'list':function(){
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
        }
    }

    return methods[method].bind(this)();
}

/**
 * Block's declaration
 * @param  {String} name
 * @param  {Object} proto
 */
$.jbDefine = function(name, proto) {
    if (helpers.decls[name]) {
        throw new Error('Can`t redefine ' + name + ' block');
    }
    helpers.decls[name] = proto;
};

// to get Block from global outspace
$.Block = Block;