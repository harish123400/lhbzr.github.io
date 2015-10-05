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
        cwd: '<%= src_html %>',
        src: '**/*.html',
        dest: '<%= dist_html %>'
      }]
    }
  });
};
