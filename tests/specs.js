var html = [
    '<div class="js-foo-1" data-component="counter" data-props=\'{ "step": 1 }\'></div>',
    '<div class="js-foo-2" data-component="counter" data-props=\'{ "step": 2 }\'></div>',
    '<div class="js-bar" data-component="bar"></div>',
    '<div class="js-baz" data-component="baz"><span class="foo"></span></div>'
].join();

describe('jblocks', function() {
    beforeEach(function() {
        this.app = document.getElementById('app');
        this.app.innerHTML = html;

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
                oninit: function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'))
                    baz.on('my-custom-event', this.onBazEventFired.bind(this));
                },
                onBazEventFired: function() {
                    this.hasCatchedEventFromBaz = true;
                }
            }
        });
        jBlocks.define('baz', {
            events: {
                'click': 'onClickSelf',
                'click .foo': 'onClickFoo'
            },
            methods: {
                onClickSelf: function() {
                    this.clickedOnSelf = true;
                },
                onClickFoo: function() {
                    this.clickedOnBaz = true;
                }
            }
        });
    });
    afterEach(function() {
        this.app.innerHTML = '';

        [].forEach.call(document.querySelector('[data-component]'), function(node) {
            var instance = jBlocks.get(node);
            var name = instance.name;
            instance.destroy();
            jBlocks.forget(name);
        });
    });

    describe('#get', function() {
        it('should create and return an instance', function() {
            var instance = jBlocks.get(document.querySelector('.js-bar'));

            instance.should.be.an.instanceOf(jBlocks);
            instance.name.should.eql('bar')
        });
    });
    describe('#destroy', function() {
        it('should destroy an instance binded to node', function() {
            var instance = jBlocks.get(document.querySelector('.js-bar'));

            jBlocks.destroy(node);
            instance.should.eql(null);
        });
        it('should destroy an instance called on itself', function() {
            var instance = jBlocks.get(document.querySelector('.js-bar'));

            instance.destroy();
            instance.should.eql(null);
        });
    });
    describe('#define', function() {
        beforeEach(function() {
            this.app.innerHTML += '<div class="js-mega-component" data-component="mega-component"></div>';
            jBlocks.define('mega-component');
        });
        it('should decl a new component', function() {
            var instance = jBlocks.get(document.querySelector('.js-mega-component'));
            instance.should.be.an.instanceOf(jBlocks);
        });
        it('should throw an error if component has been already declared', function() {
            try {
                jBlocks.define('foo')
            } catch(e) {
                e.should.be.ok();
            }
        });
    });
    describe('#forget', function() {
        it('should remove existing declaration', function() {
            jBlocks.forget('bar');

            var instance = jBlocks.get(document.querySelector('.js-bar'))
            instance.should.eql(null);
        });
    });
    describe('#lifecycle', function() {
        describe('oninit', function() {
            it('should be called when a new instance created', function() {
                var instance = jBlocks.get(document.querySelector('.js-bar'));

                instance.inited.should.eql(true);
            });
        });
        describe('ondestroy', function() {
            it('should be called when a new instance destroyed', function() {
                var instance = jBlocks.get(document.querySelector('.js-bar'));

                instance.destroy();
                instance.inited.should.eql(false);
            });
        });
    });
    describe('#events', function() {
        describe('emit', function() {
            it('should emit a new event for all subscribers', function() {
                var instanceBar = jBlocks.get(document.querySelector('.js-bar'));
                var instanceBaz = jBlocks.get(document.querySelector('.js-baz'));

                instanceBaz.emit('my-custom-event');
                instanceBar.hasCatchedEventFromBaz.should.eql(true);
            });
        });
        describe('on', function() {
            it('should subsribe component for an event', function() {
                var instance = jBlocks.get(document.querySelector('.js-bar'));
                var fired = false;

                instance.on('b-inited', function() {
                    fired = true;
                });
                fired.should.eql(true);
            });
        });
        describe('events section', function() {
            define('should handle dom events', function() {
                it('on specified inner element', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz .foo').click();

                    baz.clickedOnBaz.should.eql(true);
                    baz.clickedOnSelf.should.eql(false);
                });
                it('on root element', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz').click();

                    baz.clickedOnBaz.should.eql(false);
                    baz.clickedOnSelf.should.eql(true);
                });
            });
        });
    });
    describe('#props', function() {
        it('should be attached to the instance', function() {
            var foo1 = jBlocks.get(document.querySelector('.js-foo-1'));
            var foo2 = jBlocks.get(document.querySelector('.js-foo-2'));

            foo1.props.step.should.eql(1);
            foo2.props.step.should.eql(2);
        });
    });
});
