module.exports = function (grunt) {
  'use strict';

  grunt.config('postcss', {
    options: {
      map: true,
      processors: [
        require('autoprefixer')({
          browsers: ['last 40 version']
        })
      ]
    },
    main: {
      src: ['dist/css/main.css']
    }
  });
};
