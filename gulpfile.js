var gulp         = require('gulp');
// var jshint       = require('gulp-jshint')
var sass         = require('gulp-sass');
var susy         = require('susy');
// var watch        = require('gulp-watch');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var replace      = require('gulp-replace');
var livereload   = require('gulp-livereload');
// var minify       = require('gulp-minify');
// var uglify       = require('gulp-uglify');
var uglifycss    = require('gulp-uglifycss');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
// var concat-vendor = require('gulp-concat-vendor');
// var gzip         = require('gulp-gzip');


var gzip_options = {
  threshold: '1kb',
  gzipOptions: {
    level: 9
  }
};

var cssDest = './dist/css/';
var jsDest  = './dist/js/';
var scssDir = './stylesheets/scss/';

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(scssDir+'app.scss',['sass-css'], function(){
    livereload.reload('index.html');
  });
});

gulp.task('sass-css', function() {
  gulp.src(scssDir+'app.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(cssDest))
      .pipe(livereload());
});

gulp.task('default', ['sass-css', 'watch']);

gulp.task('styles', function() {
  gulp.src(scssDir+'app.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(cssDest))
      .pipe(livereload());
});

gulp.task('sass-css-min-gzip', function() {
  return gulp.src(scssDir+'*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(cssDest))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglifycss())
            .pipe(gulp.dest(cssDest))
            // .pipe(gzip(gzipOptions))
            // .pipe(gulp.dest(cssDest))
            .pipe(livereload());
});

// gulp.task('scripts', function() {
//   gulp.src('./vendor/*')
//   .pipe(vendor('vendor.js'))
//   .pipe(gulp.dest('./dist/'));  
// });


// http://foundation.zurb.com/sites/docs/v/5.5.3/sass.html
gulp.task('new-sass',function() {
  gulp.src(scssDir+'*.scss')
    .pipe(sass({
      includePaths: ['bower_components/foundation-sites/scss']
    }))
    .pipe(gulp.dest(cssDest));
})

gulp.task('sass', function() {
  gulp.src(scssDir+'app.scss')
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
    .pipe(gulp.dest(cssDest))
    .pipe(connect.reload());
});

gulp.task('uglifycss', function() {
  gulp.src(cssDest+'*.css')
    .pipe(uglifycss({
      "max-line-len": 80
    }))
    .pipe(gulp.dest('cssDest'))
})

gulp.task('autoprefixer', function () {
  gulp.src(cssDest+'*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(cssDest));
});


