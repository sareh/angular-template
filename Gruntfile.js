module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    sass_globbing: {
      your_target: {
        options: {
          useSingleQuotes: false,
          signature: '// Hello, World!'
        },
        files: {
          './stylesheets/scss/foundation-imports.scss': './bower_components/foundation-sites/foundation-sites-6.0.6/scss/**/*.scss',
          // './stylesheets/scss/imports.scss': './stylesheets/scss/app.scss',
        }
      }
    },
    sass_2: {
      options: {
        sourceMap: true
      },
      develop: {
        files: {
          'main.css': 'imports.scss'
        }
      }
    },
    sass: {
      dist: {
        files: {
          // './dist/css/foundation.css': [
          //   // './bower_components/foundation-sites/scss/foundation.scss',
          //   // './bower_components/foundation-sites/scss/settings/_settings.scss',
          //   // './bower_components/foundation-sites/scss/**/*.scss'

          //   './bower_components/foundation-sites/scss/_global.scss'
          //   ],
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
  grunt.loadNpmTasks('grunt-sass-globbing');
  grunt.registerTask('default',['sass']);
}