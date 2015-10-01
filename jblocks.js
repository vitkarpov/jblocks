(function($) {

    var _cache = {};
    var _decls = {};

    /**
     * Return unique id
     */
    var guid = (function() {
        var id = 0;

        return function() {
            return 'b-' + id++;
        }
    }());

    /**
     * Block's constructor
     */
    var Block = function(block) {
        var name = block.data('b');
        var params = block.data('p');
        var decl = _decls[name];

        if (!decl) {
            throw new Error(name + ' block is not declared');
        }

        var info = {
            name: name,
            params: params,
            $node: block,
            _id: guid()
        };
        $.extend(this, info, decl.methods);

        this._addEvents();
        this._setInited();
        this._trigger('b-inited');
    };

    /**
     * Adds events to block's node according its decl
     */
    Block.prototype._addEvents = function() {
        var decl = _decls[this.name];
        var events = decl.events;

        for (var e in events) {
            if (events.hasOwnProperty(e)) {
                var p = e.split(' ');
                var handler = events[e];

                if (typeof handler === 'string') {
                    handler = decl.methods[handler];
                }
                this.$node.on(p[0], p[1], handler.bind(this));
            }
        }
    };

    /**
     * Mark the block as inited
     */
    Block.prototype._setInited = function() {
        this.$node.addClass('jb-inited');
    };

    /**
     * Triggers specified event
     */
    Block.prototype._trigger = function(name) {
        this.$node.trigger(name);
    };

    /**
     * Removes block from cache and triggers b-destroy event
     */
    Block.prototype.destroy = function() {
        _cache[this._id] = null;
        this.$node.removeClass('jb-inited');
        this.$node.off();
        this._trigger('b-destroyed');
    };

    /**
     * Block's declaration
     * @param  {String} name
     * @param  {Object} proto
     */
    $.define = function(name, proto) {
        if (_decls[name]) {
            throw new Error('Can`t redefine ' + name + ' block');
        }
        _decls[name] = proto;
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
                return _cache[bid];
            }

            var block = new Block($b);
            bid = block._id;

            $b.data('_bid', bid);
            _cache[bid] = block;

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

    // for some need to get Block constuctor
    $.Block = Block;

}(jQuery));
