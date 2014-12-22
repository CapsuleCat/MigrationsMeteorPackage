module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
      // Metadata
      pkg: grunt.file.readJSON('package.json'),
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= props.license %> */\n',
      // JS Hint
      // =======
      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        core: {
          src: '../*.js'
        }
      },
      // JS Coding Style
      // ===============
      jscs: {
        options: {
          config: '.jscsrc'
        },
        core: {
          src: '<%= jshint.core.src %>'
        }
      },
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    // Default task
    grunt.registerTask('default', [
        'jshint', 
        'jscs']);
};
