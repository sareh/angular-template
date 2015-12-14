var gulp       = require('gulp');
// var jshint     = require('gulp-jshint')
var sass       = require('gulp-sass');
var rename     = require('gulp-rename');
var concat     = require('gulp-concat');
var replace    = require('gulp-replace');
var livereload = require('gulp-livereload');
// var minify     = require('gulp-minify');
// var uglify     = require('gulp-uglify');
var uglifycss  = require('gulp-uglifycss');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

gulp.task('default', function() {
  
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('stylesheets/scss/*.scss',['styles'], function(){
    livereload.reload('index.html');
  });
});

gulp.task('styles', function() {
    gulp.src('stylesheets/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('stylesheets/css/'))
        .pipe(livereload());
});

gulp.task('uglifycss', function() {
  gulp.src('stylesheets/css/*.css')
    .pipe(uglifycss({
      "max-line-len": 80
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('autoprefixer', function () {
  gulp.src('stylesheets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dest'));
});

// gulp.task('default', ['styles', 'autoprefixer', 'watch']);
gulp.task('default', ['styles', 'watch']);
