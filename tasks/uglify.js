module.exports = function (grunt) {
  'use strict';

  grunt.config('uglify', {
    main: {
      options: {
        mangle: false,
      },
      files: [{
        expand: true,
        cwd: '<%= dist_js %>',
        src: ['*.js'],
        dest: '<%= dist_js %>',
        ext: '.min.js',
        extDot: 'first'
      }]
    }
  });
};
