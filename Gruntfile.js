module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    stylus: {
      compile: {
        options: {
          paths: ['stylus']
         },
         files: {
          'static/css/main.css': ['stylus/main.styl'] // compile and concat into single file
       }
      }
    },
    connect: {
      server: {
        options: {
          port: 3020
        }
      }
    },
    watch: {
      scripts: {
        files: ['js'],
        tasks: ['uglify']
      },
      styl: {
        files: ['stylus/*.styl'],
        tasks: ['stylus']
      },
      livereload: {
          files: ['static/css/*.css'],
          options: {
            livereload: true
          }
      }
    }
  });

  // contrib
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // default
  grunt.registerTask('default', ['stylus:compile','connect','watch']);

};
