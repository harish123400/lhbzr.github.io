module.exports = function (grunt) {
  'use strict';

  grunt.config('imagemin', {
    options: {
      optimizationLevel: 7
    },
    main: {
      files: [{
        expand: true,
        cwd: '<%= src_img %>/',
        src: ['**/*.{png,jpg,gif,svg}'],
        dest: '<%= dist_img %>/'
      }]
    }
  });
};
