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
    this.$node.on(this._getEventName(name), callback);
    return this;
};

/**
 * Removes handler for block's event
 * @param  {string} name
 * @param  {function} callback
 */
Block.prototype.off = function(name, callback) {
    var event = this._getEventName(name);

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
            var p = e.split(' ', 2);
            var eventName = p[0];
            var selector = p[1];
            var handler = events[e];

            if (this._isInnerEvent(eventName)) {
                eventName = this._getEventName(eventName);
            }
            if (typeof handler === 'string') {
                handler = decl.methods[handler];
            }

            this.$node.on(eventName, selector, handler.bind(this));
        }
    }
};

Block.prototype._isInnerEvent = function(id) {
    return ['b-inited', 'b-destroyed'].indexOf(id) > -1;
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
 * @param {*} additional data for callback
 */
Block.prototype.emit = function(name, data) {
    this.$node.trigger(this._getEventName(name), data);
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

/**
 * Возвращает имя события с учетом пространства имен
 * @param  {string} name
 * @return {string}
 */
Block.prototype._getEventName = function(name) {
    return this._id + ':' + name;
};

module.exports = Block;
