var html = [
    '<div class="foo" data-b="counter" data-p=\'{ "step": 2 }\'>',
    '<button class="js-inc">+</button>',
    '<button class="js-dec">-</button>',
    '<span class="js-info">0</span>',
    '</div>'
].join();

describe('jblocks', function() {
    beforeEach(function() {
        this.$html = $(html);
        this.$html.appendTo(document.body);
    });
    afterEach(function() {
        this.$html.remove();
    });

    describe('#getBlocks', function() {
        it('should return jquery collection of blocks instances', function() {
            $('.foo').jblocks('get').each(function() {
                this.should.be.an.instanceOf($.Block);
            });
        });

        describe('when block is not defined', function() {
            beforeEach(function() {
                this.$unknown = $('<div class="bar" data-b="unknow"></div>');
                this.$unknown.appendTo(document.body);
            });
            afterEach(function() {
                this.$unknown.remove();
            });

            it('should throw an error', function() {
                try {
                    $('.bar').jblocks('get');
                } catch(e) {
                    e.should.be.ok();
                }
            });
        });
    });

    describe('#initBlocks', function() {
        it('should init blocks', function() {
            $(document).jblocks('init');
            $('.foo').hasClass('jb-inited').should.be.true;
        });
    });

    describe('#destroyBlocks', function() {
        it('should destroy blocks', function() {
            $(document).jblocks('destroy');
            $('.foo').hasClass('jb-inited').should.be.false;
        });
    });

    describe('#events', function() {
        describe('on', function() {
            it('should attach a handler', function() {
                var called = false;
                var block = $('.foo').jblocks('get')[0];

                block.on('inc', function() {
                    called = true;
                });
                block.inc();

                called.should.be.ok();
            });
        });
        describe('off', function() {
            it('should remove the spicific handler', function() {
                var called = false;
                var block = $('.foo').jblocks('get')[0];

                var handler = function() {
                    called = true;
                };

                block.on('inc', handler);
                block.off('inc', handler);
                block.inc();

                called.should.be.not.ok();
            });
            it('should remove all handlers if second arg is not defined', function() {
                var called = 0;
                var block = $('.foo').jblocks('get')[0];

                block.on('inc', function() {
                    called++
                });
                block.on('inc', function() {
                    called++
                });
                block.off('inc');
                block.inc();

                called.should.be.eql(0);
            });
            it('should remove all events if there are no args defined', function() {
                var called = 0;
                var block = $('.foo').jblocks('get')[0];

                block.on('inc', function() {
                    called++
                });
                block.on('dec', function() {
                    called++
                });
                block.off();
                block.inc();

                called.should.be.eql(0);
            });
        });
        describe('declaration', function() {
            it('should add event to the block`s node if selector is not specified', function() {
                var block = $('.foo').jblocks('get')[0];
                var called = false;

                block.on('clicked', function() {
                    called = true;
                });
                block.$node.click();

                called.should.be.ok();
            });
        });
    });

    describe('Block', function() {
        it('should have params declared in html', function() {
            $('.foo').jblocks('get').each(function() {
                this.params.should.eql({ step: 2 });
            });
        });

        it('should have declared methods', function() {
            $('.foo').jblocks('get').each(function() {
                this.inc.should.be.a.Function;
            });
        });
    });
});
