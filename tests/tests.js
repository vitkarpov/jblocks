var html = [
    '<div class="foo" data-b="сounter" data-p=\'{ "step": 2 }\'>',
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
            $('.foo').getBlocks().each(function() {
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
                    $('.bar').getBlocks();
                } catch(e) {
                    e.should.be.ok();
                }
            });
        });
    });

    describe('#initBlocks', function() {
        it('should init blocks', function() {
            $(document).initBlocks();
            $('.foo').hasClass('jb-inited').should.be.true;
        });
    });

    describe('#destroyBlocks', function() {
        it('should destroy blocks', function() {
            $(document).destroyBlocks();
            $('.foo').hasClass('jb-inited').should.be.false;
        });
    });

    describe('Block', function() {
        it('should have params declared in html', function() {
            $('.foo').getBlocks().each(function() {
                this.params.should.eql({ step: 2 });
            });
        });

        it('should have declared methods', function() {
            $('.foo').getBlocks().each(function() {
                this.inc.should.be.a.Function;
            });
        });
    });
});
