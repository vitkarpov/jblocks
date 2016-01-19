var helpers = require('./helpers');

/**
 * Block's constructor
 */
var Block = function(block) {
    var name = block.data('b');
    var params = block.data('p');
    var decl = helpers.decls[name];

    if (!decl) {
        throw new Error(name + ' block is not declared');
    }

    var info = {
        name: name,
        params: params,
        $node: block,
        _id: helpers.guid()
    };
    $.extend(this, info, decl.methods);

    this._addEvents();
    this._setInited();
    this.emit('b-inited');
};

/**
 * Adds handler for block's event
 * @param  {string} name
 * @param  {function} callback
 */
Block.prototype.on = function(name, callback) {
    this.$node.on(this.name + ':' + name, callback);
    return this;
};

/**
 * Removes handler for block's event
 * @param  {string} name
 * @param  {function} callback
 */
Block.prototype.off = function(name, callback) {
    var event = this.name + ':' + name;

    if (!name) {
        this.$node.off();
    } else if (!callback) {
        this.$node.off(event);
    } else {
        this.$node.off(event, callback);
    }

    return this;
};

/**
 * Adds events to block's node according its decl
 */
Block.prototype._addEvents = function() {
    var decl = helpers.decls[this.name];
    var events = decl.events;

    for (var e in events) {
        if (events.hasOwnProperty(e)) {
            var p = e.split(' ',2);
            var handler = events[e];
            if (typeof handler === 'string') {
                handler = decl.methods[handler];
            }

            this.on(p[0], p[1], handler.bind(this));
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
 * @param {string} name
 */
Block.prototype.emit = function(name) {
    this.$node.trigger(this.name + ':' + name);
    return this;
};

/**
 * Removes block from cache and triggers b-destroy event
 */
Block.prototype.destroy = function() {
    helpers.cache[this._id] = null;
    this.$node.removeClass('jb-inited');
    this.off();
    this.emit('b-destroyed');
};

module.exports = Block;
