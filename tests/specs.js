var html = [
    '<div class="js-foo-1" data-component="foo" data-props=\'{ "step": 1 }\'></div>',
    '<div class="js-foo-2" data-component="foo" data-props=\'{ "step": 2 }\'></div>',
    '<div class="js-bar" data-component="bar"></div>',
    '<div class="js-baz" data-component="baz"><span class="foo"></span><span class="bar"><span class="bar-inner"></span></div>'
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
            this.emit('inited', 'hello, world!');
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
            it('should be called when new instance has been created', function() {
                var instance = jBlocks.get(document.querySelector('.js-foo-1'));

                instance.inited.should.eql(true);
            });
        });
        describe('ondestroy', function() {
            it('should be called when a new instance has been destroyed', function() {
                var instance = jBlocks.get(document.querySelector('.js-foo-1'));

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

                instanceBar.on('my-custon-event', function(data) {
                    data.a.should.eql(2);
                });
                instanceBaz.emit('my-custom-event', {
                    a: 2
                });
            });
        });
        describe('on', function() {
            it('should subsribe component for an event', function() {
                var instance = jBlocks.get(document.querySelector('.js-bar'));

                instance.on('inited', function(data) {
                    data.should.eql('hello, world!');
                });
            });
        });
        describe('events section', function() {
            describe('should handle dom events', function() {
                it('for root element', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz').click();

                    baz.clickedOnSelf.should.eql(true);
                });
                it('for the specifying element', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz .foo').click();

                    baz.clickedOnFoo.should.eql(true);
                });
                it('for element inside the specifying one', function() {
                    var baz = jBlocks.get(document.querySelector('.js-baz'));
                    document.querySelector('.js-baz .bar-inner').click();

                    baz.clickedOnBar.should.eql(true);
                })
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
