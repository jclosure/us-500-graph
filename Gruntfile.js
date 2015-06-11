// Gruntfile.js
module.exports = function(grunt){

  var banner = '/*n<%= pkg.name %> <%= pkg.version %>';
  banner += '- <%= pkg.description %>n<%= pkg.repository.url %>n';
  banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>n*/n';

  // Load grunt mocha task
  grunt.loadNpmTasks('grunt-mocha');

  
  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  // Add watch task
  grunt.loadNpmTasks('grunt-contrib-watch');
  
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
          //'models/entity', //from proj root
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
          clearRequireCache: true,
          quiet: false
        },
        src: ['test/live/*.js']
      }
    },

    watch: {
      js: {
        options: {
          spawn: false,
          require: [
           'models/state' 
          ]
        },
        files: '**/*.js',
        tasks: ['default']
      }
    }

    
  });

  // On watch events, if the changed file is a test file then configure mochaTest to only
  // run the tests from that file. Otherwise run all the tests
  var defaultTestSrc = grunt.config('mochaTest.test.src');
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('mochaTest.test.src', defaultTestSrc);
    if (filepath.match('test/')) {
      grunt.config('mochaTest.test.src', filepath);
    }
  });

  grunt.registerTask('default', 'mochaTest');
  grunt.registerTask('web', ['mocha']);
};

