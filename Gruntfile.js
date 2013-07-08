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
          'app/static/css/main.css': ['app/stylus/main.styl'] // compile and concat into single file
       }
      }
    },
    connect: {
      server: {
        options: {
          port: 3020,
          base: "app"
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/js'],
        tasks: ['uglify']
      },
      styl: {
        files: ['app/stylus/*.styl'],
        tasks: ['stylus']
      },
      livereload: {
          files: ['app/static/css/*.css'],
          options: {
            livereload: true
          }
      }
    },
    requirejs: {
      compile: {
        options: {
          name: "main",
          MainConfigFile: "app/js/require-config.js",
          optimize: "none",
          findNestedDependencies: false,
          baseUrl: "app/js",
          out: "build/opt.js"
        }
      }
    }
  });

  // contrib
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['requirejs']);
  // default
  grunt.registerTask('default', ['stylus:compile','connect','watch']);

};
