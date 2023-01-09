/**
 * @jest-environment jsdom
 */

var jBlocks = require('../');

var html = [
    '<div class="js-foo-1" data-component="foo" data-props=\'{ "step": 1 }\'></div>',
    '<div class="js-foo-2" data-component="foo" data-props=\'{ "step": 2 }\'></div>',
    '<div class="js-bar" data-component="bar"></div>',
    '<div class="js-baz" data-component="baz"><span class="foo"></span><span class="bar"><span class="bar-inner"></span></div>',
    '<div class="js-counter" data-component="counter"></div>'
].join();

jBlocks.define('foo', {
    methods: {
        oninit: function() {
            this.inited = true;
        },
        ondestroy: function() {
            this.inited = false;
        }
    }
});
jBlocks.define('bar', {
    methods: {
        sayhi: function() {
            this.emit('hello', 'hello, world!');
        }
    }
});
jBlocks.define('baz', {
    events: {
        'click': 'onClickSelf',
        'click .foo': 'onClickFoo',
        'click .bar': 'onClickBar'
    },
    methods: {
        oninit: function() {
            this.clickedOnSelf = false;
            this.clickedOnFoo = false;
            this.clickedOnBar = false;
        },
        onClickSelf: function() {
            this.clickedOnSelf = true;
        },
        onClickFoo: function() {
            this.clickedOnFoo = true;
        },
        onClickBar: function() {
            this.clickedOnBar = true;
        }
    }
});
jBlocks.define('counter', {
    methods: {
        inc: function() {
            this.emit('changed');
        }
    }
});

describe('jblocks', function() {
    let app;

    beforeEach(function() {
        app = document.createElement('div');
        app.innerHTML = html;
        document.body.appendChild(app);
    });
    afterEach(function() {
        document.body.innerHTML = '';
    });

    describe('#get', function() {
        it('should create and return an instance', function() {
            var instance = jBlocks.get(document.querySelector('.js-bar'));

            expect(instance.name).toBe('bar');
        });
        it('should return an instance of jBlocks.Component', function() {
            var instance = jBlocks.get(document.querySelector('.js-bar'));

            expect(instance instanceof jBlocks.Component).toBe(true);
        });
    });
    describe('#destroy', function() {
        var node, instance, oldId;

        beforeEach(function() {
            node = document.querySelector('.js-bar');
            instance = jBlocks.get(node);
            oldId = instance.__id;
        });
        it('should destroy an instance binded to node', function() {
            jBlocks.destroy(node);
            var newId = jBlocks.get(node).__id;

            expect(newId).not.toBe(oldId);
        });
        it('should destroy an instance called on itself', function() {
            instance.destroy();
            var newId = jBlocks.get(node).__id;

            expect(newId).not.toBe(oldId);
        });
    });
    describe('#define', function() {
        beforeEach(function() {
            app.innerHTML += '<div class="js-mega-component" data-component="mega-component"></div>';
            jBlocks.define('mega-component');
        });
        afterEach(function() {
            jBlocks.forget('mega-component');
        })
        it('should decl a new component', function() {
            var instance = jBlocks.get(document.querySelector('.js-mega-component'));
            expect(instance.name).toBe('mega-component');
        });
        it('should throw an error if component has been already declared', function() {
            expect(() => jBlocks.define('foo')).toThrow('foo has already been declared');
        });
    });
    describe('#forget', function() {
        beforeEach(function() {
            jBlocks.define('mega-foo', {});
        });
        it('should remove existing declaration', function() {
            jBlocks.forget('mega-foo');
            expect(() => jBlocks.define('mega-foo')).not.toThrow();
        });
    });
    describe('#lifecycle', function() {
        describe('oninit', function() {
            it('should be called when new instance has been created', function() {
                var instance = jBlocks.get(document.querySelector('.js-foo-1'));

                expect(instance.inited).toBe(true);
            });
        });
        describe('ondestroy', function() {
            it('should be called when a new instance has been destroyed', function() {
                var instance = jBlocks.get(document.querySelector('.js-foo-1'));

                instance.destroy();
                expect(instance.inited).toBe(false);
            });
        });
    });
    describe('#events', function() {
        describe('emit', function() {
            it('should emit a new event for all subscribers', function() {
                var instanceBar = jBlocks.get(document.querySelector('.js-bar'));
                var instanceBaz = jBlocks.get(document.querySelector('.js-baz'));

                instanceBar.on('my-custon-event', function(data) {
                    expect(data.a).toBe(2);
                });
                instanceBaz.emit('my-custom-event', {
                    a: 2
                });
            });
            it('should call a handler when component emits an event inside its method (bug #13)', function() {
                var counter = jBlocks.get(document.querySelector('.js-counter'));
                var called = false;

                counter.on('changed', function() {
                    called = true;
                });
                counter.inc();

                expect(called).toBe(true);
            });
        });
        describe('on', function() {
            it('should subsribe component for an event', function() {
                var instance = jBlocks.get(document.querySelector('.js-bar'));

                instance.on('hello', function(data) {
                    expect(data).toBe('hello, world!');
                });
                instance.sayhi();
            });
        });
        describe('events section', function() {
            describe('should handle dom events', function() {
                it('for root element', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz').click();

                    expect(baz.clickedOnSelf).toBe(true);
                });
                it('for the specifying element', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz .foo').click();

                    expect(baz.clickedOnFoo).toBe(true);
                    expect(baz.clickedOnBar).toBe(false);
                });
                it('for element inside the specifying one', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz .bar-inner').click();

                    expect(baz.clickedOnBar).toBe(true);
                    expect(baz.clickedOnFoo).toBe(false);
                });
                it('should pass event as an argument to the handler', function() {
                    var rootNode = document.querySelector('.js-baz')
                    var counter = jBlocks.get(rootNode);
                    var _onClickSelf = counter.onClickSelf;
                    counter.onClickSelf = function(e) {
                        expect(e.target).toBe(rootNode);
                    }
                    rootNode.click();
                    counter.onClickSelf = _onClickSelf;
                });
            });
        });
    });
    describe('#props', function() {
        it('should be attached to the instance', function() {
            var foo1 = jBlocks.get(document.querySelector('.js-foo-1'));
            var foo2 = jBlocks.get(document.querySelector('.js-foo-2'));

            expect(foo1.props.step).toBe(1);
            expect(foo2.props.step).toBe(2);
        });
    });
});
