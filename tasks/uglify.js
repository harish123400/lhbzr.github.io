module.exports = function (grunt) {
  'use strict';

  grunt.config('uglify', {
    main: {
      files: [{
        expand: true,
        cwd: 'src/js',
        src: ['**/*.js'],
        dest: 'dist/js',
        ext: '.min.js',
        extDot: 'first'
      }]
    }
  });
};
