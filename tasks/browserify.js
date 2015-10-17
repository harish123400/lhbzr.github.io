module.exports = function (grunt) {
  'use strict';

  grunt.config('browserify', {
    main: {
      files: {
        '<%= dist_js %>/main.js': '<%= src_js %>/main.js'
      }
    }
  });
};
