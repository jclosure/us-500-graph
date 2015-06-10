// Gruntfile.js
module.exports = function(grunt){

  var banner = '/*n<%= pkg.name %> <%= pkg.version %>';
  banner += '- <%= pkg.description %>n<%= pkg.repository.url %>n';
  banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>n*/n';

  // Load grunt mocha task
  grunt.loadNpmTasks('grunt-mocha');

  
  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Mocha
    mocha: {
      all: {
        src: ['test/testrunner.html'],
      },
      options: {
        run: true,
        require: [
          'models/entity', //from proj root
          //'./globals.js',
          //function(){ testVar1=require('./stuff'); },
          //function(){ testVar2='other-stuff'; }
        ]
      }
    },
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt',
          quiet: false
        },
        src: ['test/**/*.js']
      }
    }
  });


  grunt.registerTask('default', ['mocha','mochaTest']);
};

