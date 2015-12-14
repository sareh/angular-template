var gulp       = require('gulp');
var jshint     = require('gulp-jshint')
var sass       = require('gulp-sass');
var rename     = require('gulp-rename');
var concat     = require('gulp-concat');
var replace    = require('gulp-replace');
var livereload = require('gulp-livereload');
var minify     = require('gulp-minify');
var uglify     = require('gulp-uglify');
var uglifycss  = require('gulp-uglifycss');

gulp.task('default', function() {
  
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/scss/**/*.scss',['styles'], function(){
    livereload.reload('index.html');
  });
});

gulp.task('styles', function() {
    gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
        .pipe(livereload());
});

gulp.task('uglifycss', function() {
  gulp.src('css/**/*.css')
    .pipe(uglifycss({
      "max-line-len": 80
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./stylesheets/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['styles', 'watch']);
