module.exports = function (grunt) {
  'use strict';

  grunt.config('uglify', {
    main: {
      files: [{
        expand: true,
        cwd: '<%= src_js %>',
        src: ['*.js'],
        dest: '<%= dist_js %>',
        ext: '.min.js',
        extDot: 'first'
      }]
    }
  });
};
