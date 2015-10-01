var gulp = require('gulp');
var mocha = require('gulp-mocha-phantomjs');

gulp.task('test', function () {
    return gulp
        .src('tests/index.html')
        .pipe(mocha({reporter: 'nyan'}));
});
