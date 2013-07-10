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
          mainConfigFile: "app/js/require-config.js", // this config is shared by the optimizer and our main.js module
          baseUrl: "app/js", // where r.js should start looking for modules
          name: "main", // kickoff file
          include: ["memer", "lodash"], // @todo, have r.js grok this from app/js file instead of redclaring
          out: "build/js/main.js"
        }
      }
    },
    copy: {
      app: {
        files: [
          {expand: true, cwd:'app', src: "static/**", dest: "dist"},
          {expand: true, flatten: true, src:'app/*.html', dest: "dist"},
          {expand: true, cwd: 'app/js', src: 'vendor/requirejs/require.js', dest:"dist/js" },
          {expand: true, cwd:'build', src: 'js/*', dest: "dist"} // optimized by require (does not include require)
        ]
      }
    }
  });

  // contrib
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['requirejs', 'copy']); // add a copy + min task here

  grunt.registerTask('default', ['stylus:compile','connect','watch']);

};
