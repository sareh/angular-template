var gulp       = require('gulp');
// var jshint     = require('gulp-jshint')
var sass       = require('gulp-sass');
var rename     = require('gulp-rename');
var concat     = require('gulp-concat');
var replace    = require('gulp-replace');
var livereload = require('gulp-livereload');
// var minify     = require('gulp-minify');
// var uglify     = require('gulp-uglify');
var uglifycss     = require('gulp-uglifycss');
var postcss       = require('gulp-postcss');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('autoprefixer');
// var concat-vendor = require('gulp-concat-vendor');

gulp.task('default', function() {
  
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('stylesheets/scss/app.scss',['styles'], function(){
    livereload.reload('index.html');
  });
});

gulp.task('scripts', function() {
  gulp.src('./vendor/*')
  .pipe(vendor('vendor.js'))
  .pipe(gulp.dest('./dist/'));  
});

gulp.task('styles', function() {
  gulp.src('stylesheets/scss/app.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('stylesheets/css/'))
      .pipe(livereload());
});

gulp.task('sass', function() {
  gulp.src('stylesheets/scss/app.scss')
    .pipe(sass({
      loadPath: ['bower_components/foundation-apps/scss', 'stylesheets/scss'],
      style: 'nested',
      bundleExec: true
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('stylesheets/css'))
    .pipe(connect.reload());
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

gulp.task('default', ['styles', 'watch']);
