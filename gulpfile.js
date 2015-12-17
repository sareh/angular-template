var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var browser  = require('browser-sync');
var gulp     = require('gulp');
var panini   = require('panini');
var rimraf   = require('rimraf');
var sequence = require('run-sequence');
var sherpa   = require('style-sherpa');

// Check for --production flag
var isProduction = !!(argv.production);
// console.log("isProduction:"+isProduction);

// Port to use for the development server.
var PORT = 8000;

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  assets: [
    'src/assets/**/*',
    '!src/assets/{!img,js,scss,views}/**/*',
    '!index.html'
  ],
  sassfounation: [
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src/'
  ],
  javascriptfoundation: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/what-input/what-input.js',
    'bower_components/foundation-sites/js/foundation.core.js',
    'bower_components/foundation-sites/js/foundation.util.*.js',
    // Paths to individual JS components defined below
    'bower_components/foundation-sites/js/foundation.abide.js',
    'bower_components/foundation-sites/js/foundation.accordion.js',
    'bower_components/foundation-sites/js/foundation.accordionMenu.js',
    'bower_components/foundation-sites/js/foundation.drilldown.js',
    'bower_components/foundation-sites/js/foundation.dropdown.js',
    'bower_components/foundation-sites/js/foundation.dropdownMenu.js',
    'bower_components/foundation-sites/js/foundation.equalizer.js',
    'bower_components/foundation-sites/js/foundation.interchange.js',
    'bower_components/foundation-sites/js/foundation.magellan.js',
    'bower_components/foundation-sites/js/foundation.offcanvas.js',
    'bower_components/foundation-sites/js/foundation.orbit.js',
    'bower_components/foundation-sites/js/foundation.responsiveMenu.js',
    'bower_components/foundation-sites/js/foundation.responsiveToggle.js',
    'bower_components/foundation-sites/js/foundation.reveal.js',
    'bower_components/foundation-sites/js/foundation.slider.js',
    'bower_components/foundation-sites/js/foundation.sticky.js',
    'bower_components/foundation-sites/js/foundation.tabs.js',
    'bower_components/foundation-sites/js/foundation.toggler.js',
    'bower_components/foundation-sites/js/foundation.tooltip.js',
    
    // 'src/assets/js/**/*.js',
    // 'src/assets/js/foundation.js'
  ],
  angularvendor: [
    'bower_components/angular/angular.min.js',
    'bower_components/angular-jwt/dist/angular-jwt.js',
    'bower_components/angular-resource/angular-resource.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/angular-aria/angular-aria.min.js',
  ],
  angularapp: [
    'src/assets/js/app.js',
    'src/assets/js/services/tokenService.js',
    'src/assets/js/services/authInterceptor.js',
    'src/assets/js/services/currentUser.js',
    'src/assets/js/models/user.js',
    'src/assets/js/models/chat.js',
    'src/assets/js/controllers/usersController.js',
    'src/assets/js/controllers/chatsController.js',
  ],
  views: [
    'src/assets/views/**/*.html',
  ]
};

// Delete the "dist" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  rimraf('dist', done);
});

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately (& "views" folder)
gulp.task('copy', function() {
  gulp.src(PATHS.assets)
    .pipe(gulp.dest('dist/assets'));
});

// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function() {
  var uncss = $.if(isProduction, $.uncss({
    html: ['src/**/*.html'],
    ignore: [
      new RegExp('^meta\..*'),
      new RegExp('^\.is-.*')
    ]
  }));

  var minifycss = $.if(isProduction, $.minifyCss());

  return gulp.src('src/assets/scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sassfounation
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe(uncss)
    .pipe(minifycss)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/css'));
});

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(PATHS.javascriptfoundation)
    .pipe($.sourcemaps.init())
    .pipe($.concat('javascript-foundation-concat.js'))
    .pipe(uglify)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/js'));
});

// Combine Angular JavaScript into one file
// In production, the file is minified
gulp.task('angularvendor', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(PATHS.angularvendor)
    .pipe($.sourcemaps.init())
    .pipe($.concat('angular-vendor-concat.js'))
    .pipe(uglify)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('angularapp', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(PATHS.angularapp)
    .pipe($.sourcemaps.init())
    .pipe($.concat('angular-app-concat.js'))
    .pipe(uglify)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/assets/js'));
});

// Copy images to the "dist" folder
// In production, the images are compressed
gulp.task('images', function() {
  var imagemin = $.if(isProduction, $.imagemin({
    progressive: true
  }));

  return gulp.src('src/assets/img/**/*')
    .pipe(imagemin)
    .pipe(gulp.dest('dist/assets/img'));
});

// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
  sequence('clean', ['pages', 'sass', 'javascript', 'angular', 'images', 'copy'], done);
});

// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], function() {
  browser.init({
    server: 'dist', port: PORT
  });
});

gulp.task('views', function() {
  // copy view files into dist
  // & minify the views.
  return gulp.src(PATHS.views)
    .pipe(gulp.dest('dist/assets/views'));
});

gulp.task('default', ['clean', 'sass', 'javascript', 'angularvendor', 'angularapp', 'views'], function() {
  gulp.watch(PATHS.assets, ['copy', browser.reload]);
  // gulp.watch(['index.html'], ['views', browser.reload]);
  gulp.watch(['src/assets/views/**/*.html'], ['views', browser.reload]);
  gulp.watch(['src/assets/scss/**/*.scss'], ['sass', browser.reload]);
  gulp.watch(['src/assets/js/**/*.js'], ['javascript', browser.reload]);
  gulp.watch(['src/assets/js/**/*.js'], ['angularvendor', browser.reload]);
  gulp.watch(['src/assets/js/**/*.js'], ['angularapp', browser.reload]);
});

