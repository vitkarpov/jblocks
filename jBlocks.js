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
        this.node = node;
        this.props = props || {};
        this.decl = declarations[this.name] || {};

        this.__id = ++gid;
        this.__events = {};
        this.__handlerDomEvents = this.__handlerDomEvents.bind(this);
        this.__bindMethods();
        this.__bindDomEvents();

        this.oninit();
    };

    Component.prototype.on = function(event, callback) {
        this.__events[event] = this.__events[event] || [];

        if (this.__events[event].indexOf(callback) === -1) {
            this.__events[event].push(callback);
        }
        return this;
    };

    Component.prototype.off = function(event, callback) {
        var callbacks = this.__events[event];
        if (!callbacks) {
            return this;
        }
        if (callbacks.indexOf(callback) > -1) {
            callbacks.splice(callbacks.indexOf(callback) - 1, 1);
        } else if (!callback) {
            this.__events[event] = [];
        }
        return this;
    };

    Component.prototype.emit = function(event, data) {
        var callbacks = this.__events[event];

        if (!callbacks) {
            return this;
        }
        var l = i = callbacks.length;

        while (l--) {
            try {
                callbacks[l - i - 1].call(this, data || {});
            } catch(e) {
                throw new Error(e.message + '. Check out ' + event + ' handler.');
            }
        }
        return this;
    };

    Component.prototype.destroy = function() {
        instances[this.name][this.__id] = null;
        this.__unbindDomEvents();
        this.__events = null;
        this.ondestroy();
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

    Component.prototype.__bindDomEvents = function() {
        this.__forEachEvent(function(event) {
            this.node.addEventListener(event, this.__handlerDomEvents);
        });
    };

    Component.prototype.__unbindDomEvents = function() {
        this.__forEachEvent(function(event) {
            this.node.removeEventListener(event, this.__handlerDomEvents);
        });
    };

    Component.prototype.__forEachEvent = function(callback) {
        var events = this.decl.events || {};

        for (var name in events) {
            if (events.hasOwnProperty(name)) {
                var parts = name.split(' ', 2);
                var event = parts[0];
                var selector = parts[1];
                var callbackName = events[name];

                callback.call(this, event, selector, callbackName);
            }
        }
    };

    Component.prototype.__handlerDomEvents = function(e) {
        var type = e.type;
        var target = e.target;
        var events = this.decl.events;

        this.__forEachEvent(function(event, selector, callbackName) {
            if (selector) {
                var node = this.node.querySelector(selector);
                if (this.__contains(node, target)) {
                    this.__tryCall(callbackName);
                }
            } else {
                this.__tryCall(callbackName);
            }
        });
    };

    Component.prototype.__tryCall = function(method) {
        try {
            return this[method]();
        } catch (e) {
            throw new Error(e.message + '. Check out ' + method);
        }
    };

    Component.prototype.__contains = function(root, child) {
        var root = root.nodeType === 9
            ? root.documentElement
            : root;
        var parent = child && child.parentNode;

        return (
            root === child ||
            !!(child && child.nodeType === 1 && parent.contains(child))
        );
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
                throw new Error(name + ' has already been declared');
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
            if (!node) {
                throw new Error('invalid node');
            }
            var name = node.getAttribute('data-component');
            if (!name) {
                throw new Error('data-component attribute is missing')
            }
            var instanceId = node.getAttribute('data-instance');
            if (!instanceId) {
                try {
                    var props = JSON.parse(node.getAttribute('data-props'));
                } catch (e) {
                    throw e;
                }
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
