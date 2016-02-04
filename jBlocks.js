var jBlocks = (function() {
    var instances = {};
    var declarations = {};
    var gid = 0;
    var noop = function() {};

    /**
     * Creates a new instance of component
     * @constructor
     * @param {HTMLElement} node
     * @param {String}      name
     * @param {Object}      props
     */
    var Component = function(node, name, props) {
        this.name = name;
        this.__id = ++gid;
        this.node = node;

        this.props = props || {};
        this.decl = declarations[this.name];

        this.__bindMethods();
        this.__bindEvents();
    };

    Component.prototype.on = function() {

    };

    Component.prototype.emit = function() {

    };

    Component.prototype.destroy = function() {
        instances[this.name][this.__id] = null;
        this.__unbindEvents();
        return null;
    };

    Component.prototype.__bindMethods = function() {
        var methods = this.decl.methods || {};

        methods.oninit = methods.oninit || noop;
        methods.ondestroy = methods.ondestroy || noop;

        for (var name in methods) {
            if (methods.hasOwnProperty(name)) {
                this[name] = methods[name];
            }
        }
    };

    Component.prototype.__bindEvents = function() {
        var events = this.decl.events || {};

        for (var name in events) {
            if (events.hasOwnProperty(name)) {
                this.__bindCustomEvent(name, events[name]);
            }
        }
    };

    Component.prototype.__unbindEvents = function() {

    };

    Component.prototype.__bindCustomEvent = function(event, handler) {
        var partsEvent = event.split(' ', 2);
        var type = partsEvent[0];
        var selector = partsEvent[1];

        // ...
    };

    return {
        /**
         * Destroys instance binded to the node
         * @param  {HTMLElement} node
         * @return {jBlocks}
         */
        destroy: function(node) {
            this.get(node).destroy();
            return this;
        },

        /**
         * Defines a new component
         * @param  {String} name
         * @param  {Object} declaration
         * @return {jBlocks}
         */
        define: function(name, declaration) {
            if (declarations[name]) {
                throw {
                    message: name + ' has already been declared'
                };
            }
            declarations[name] = declaration || {};
            return this;
        },

        /**
         * Removes declaration from cache
         * @param  {String} name name of component
         * @return {jBlocks}
         */
        forget: function(name) {
            declarations[name] = null;
            return this;
        },

        /**
         * Creates and returns a new instance of component
         * @param  {HTMLElement}  node
         * @return {Component} a new instance
         */
        get: function(node) {
            var name = node.getAttribute('data-component');
            if (!name) {
                throw {
                    message: 'data-component attribute is missing'
                };
            }
            var instanceId = node.getAttribute('data-instance');
            if (!instanceId) {
                var props = node.getAttribute('data-props');
                var instance = new Component(node, name, props);
                var instanceId = instance.__id;

                if (!instances[name]) {
                    instances[name] = {};
                }
                instances[name][instanceId] = instance;
            }
            return instances[name][instanceId];
        }
    };
}());
