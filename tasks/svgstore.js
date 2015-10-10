module.exports = function (grunt) {
  'use strict';

  grunt.config('svgstore', {
    options: {
      prefix: 'sprite-'
    },
    main : {
      files: {
        'dist/img/sprites/sprites.svg': 'src/img/sprites/*.svg'
      }
    }
  });
};
