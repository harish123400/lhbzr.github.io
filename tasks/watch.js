module.exports = function (grunt) {
  'use strict';

  grunt.config('watch', {
    css: {
      files: ['src/css/**/*.scss'],
      tasks: ['css']
    },
    js: {
      files: ['src/js/**/*.js'],
      tasks: ['js']
    }
  });
};
