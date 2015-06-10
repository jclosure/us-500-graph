// Gruntfile.js
module.exports = function(grunt){

  var banner = '/*n<%= pkg.name %> <%= pkg.version %>';
  banner += '- <%= pkg.description %>n<%= pkg.repository.url %>n';
  banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>n*/n';

  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Mocha
    mocha: {
      all: {
        src: ['test/testrunner.html'],
      },
      options: {
        run: true
        //,
        // mocha: {
        //   "debug-brk": (grunt.option('debug-brk')) ? "" : 0
        // }
      }
    }
  });

  // Load grunt mocha task
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('default', ['mocha']);
};

