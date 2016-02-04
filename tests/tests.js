var html = [
    '<div class="js-foo" data-b="counter" data-p=\'{ "step": 2 }\'></div>',
    '<div class="js-foo" data-b="counter" data-p=\'{ "step": 1 }\'></div>',
    '<div class="js-bar" data-b="bar"></div>',
    '<div class="js-baz" data-b="baz"></div>'
].join();

describe('jblocks', function() {
    beforeEach(function() {
        this.app = document.getElementById('app');
        this.app.innerHTML = html;

        jBlocks.define('foo', {
            events: {
                'b-inited': 'oninit',
                'b-destroyed': 'ondestroy'
            },
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
            events: {
                'b-inited': 'oninit'
            },
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
        jBlocks.define('baz');
    });
    afterEach(function() {
        this.app.innerHTML = '';

        [].forEach.call(document.querySelector('[data-b]'), function(node) {
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
            this.app.innerHTML += '<div class="js-mega-component" data-b="mega-component"></div>';
            jBlocks.define('mega-component');
        });
        afterEach(function() {
            jBlocks.forget('mega-component');
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
    describe('#events', function() {
        describe('b-inited', function() {
            it('should be called when a new instance created', function() {
                var instance = jBlocks.get(document.querySelector('.js-bar'));

                instance.inited.should.eql(true);
            });
        });
        describe('b-destroyed', function() {
            it('should be called when a new instance destroyed', function() {
                var instance = jBlocks.get(document.querySelector('.js-bar'));

                instance.destroy();
                instance.inited.should.eql(false);
            });
        });
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
    });

});
