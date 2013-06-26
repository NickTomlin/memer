module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/lib/columns.js',
        dest: 'js/lib/columns.min.js'
      }
    },
    stylus: {
      compile: {
        options: {
          paths: ['stylus']
         },
         files: {
          'static/css/main.css': ['stylus/*.styl'] // compile and concat into single file
       }
      }
    },
    connect: {
      server: {
        options: {
          port: 3020
        }
      },
      preview: {
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
          files: ['css/*.css'],
          options: {
            livereload: true
          }
      }
    }
  });

  // contrib
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // default
  grunt.registerTask('default', ['connect:preview','watch']);

};
