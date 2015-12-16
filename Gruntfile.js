module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    sass: {
      dist: {
        files: {
          './dist/css/app.css': './stylesheets/scss/app.scss'
        }
      }
    },
   watch: {
    css: {
      files: './stylesheets/scss/**/*.scss',
      tasks: ['sass']
    }
  }
});
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
}