var jBlocks = (function(undefined) {
    var _cache = {};
    var jBlocks = function(id, props) {}

    /**
     * Creates and returns a new instance of component
     * @param  {HTMLElement}  node  node associated with the component
     * @return {jBlocks}            a new instance
     */
    jBlocks.get = function(node) {
        var name = node.getAttribute('data-component');
        if (!name) {
            throw {
                message: 'data-component attribute is missing'
            };
        }
        _cache[name] = (_cache[name] || _cache[name] = {});

        var instanceId = node.getAttribute('data-instance');
        if (!instanceId) {
            var props = node.getAttribute('data-props');
            var instance = new Jblocks(name, props);

            _cache[name][instanceId] = instance;
        }
        return _cache[name][instanceId];
    }

    return jBlocks;
}(undefined));
