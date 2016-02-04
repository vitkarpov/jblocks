var html = [
    '<div class="js-foo-1" data-component="foo" data-props=\'{ "step": 1 }\'></div>',
    '<div class="js-foo-2" data-component="foo" data-props=\'{ "step": 2 }\'></div>',
    '<div class="js-bar" data-component="bar"></div>',
    '<div class="js-baz" data-component="baz"><span class="foo"></span></div>'
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

describe('jblocks', function() {
    beforeEach(function() {
        this.app = document.getElementById('app');
        this.app.innerHTML = html;
    });
    afterEach(function() {
        this.app.innerHTML = '';
    });

    describe('#get', function() {
        it('should create and return an instance', function() {
            var instance = jBlocks.get(document.querySelector('.js-bar'));

            instance.name.should.eql('bar');
        });
    });
    describe('#destroy', function() {
        beforeEach(function() {
            this.node = document.querySelector('.js-bar');
            this.instance = jBlocks.get(this.node);
            this.oldId = this.instance.__id;
        });
        it('should destroy an instance binded to node', function() {
            jBlocks.destroy(this.node);
            var instance = jBlocks.get(this.node);
            var newId = instance.__id;

            newId.should.not.eql(this.oldId);
        });
        it('should destroy an instance called on itself', function() {
            this.instance.destroy();
            var instance = jBlocks.get(this.node);
            var newId = instance.__id;

            newId.should.not.eql(this.oldId);
        });
    });
    describe('#define', function() {
        beforeEach(function() {
            this.app.innerHTML += '<div class="js-mega-component" data-component="mega-component"></div>';
            jBlocks.define('mega-component');
        });
        afterEach(function() {
            jBlocks.forget('mega-component');
        })
        it('should decl a new component', function() {
            var instance = jBlocks.get(document.querySelector('.js-mega-component'));
            instance.name.should.eql('mega-component');
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
            var catched = false;

            try {
                jBlocks.define('bar')
            } catch(e) {
                catched = true;
            }
            catched.should.be.eql(false);
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
            describe('should handle dom events', function() {
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
