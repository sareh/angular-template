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

gulp.task('default', ['styles', 'watch']);
