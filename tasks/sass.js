module.exports = function (grunt) {
  'use strict';

  grunt.config('sass', {
    options: {
      sourceMap: true,
      outputStyle: 'compressed'
    },
    main: {
      files: {
        '<%= dist_css %>/main.css': '<%= src_css %>/main.scss'
      }
    }
  });
};
