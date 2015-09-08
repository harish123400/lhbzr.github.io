module.exports = function (grunt) {
  'use strict';

  grunt.config('htmlmin', {
    main: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      files: [{
        expand: true,
        cwd: '_site',
        src: '**/*.html',
        dest: '_site'
      }]
    }
  });
};
