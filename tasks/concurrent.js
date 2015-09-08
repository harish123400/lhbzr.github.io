module.exports = function (grunt) {
  'use strict';

  grunt.config('concurrent', {
    serve: [
      'shell:serve',
      'browserSync',
      'watch'
    ],
    build: [
      'sass:main',
      'uglify:main',
      'imagemin:main'
    ],
    options: {
      logConcurrentOutput: true
    }
  });
};
