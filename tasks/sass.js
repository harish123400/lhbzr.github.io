module.exports = function (grunt) {
  'use strict';

  grunt.config('sass', {
    options: {
      sourceMap: true,
      outputStyle: 'compressed'
    },
    main: {
      files: {
        'dist/css/main.css': 'src/css/main.scss'
      }
    }
  });
};
