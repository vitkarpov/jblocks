var gulp = require('gulp');
var mocha = require('gulp-mocha-phantomjs');
var browserify = require('gulp-browserify');

gulp.task('test', function() {
    return gulp
        .src('tests/index.html')
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('build', function() {
    return gulp
        .src('src/jblocks.js')
        .pipe(browserify())
        .pipe(gulp.dest('dist'))
});
