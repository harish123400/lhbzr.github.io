module.exports = function (grunt) {
  'use strict';

  grunt.config('shell', {
    serve: {
      command: 'jekyll serve --no-watch'
    },
    build: {
      command: 'jekyll build'
    }
  });
};
