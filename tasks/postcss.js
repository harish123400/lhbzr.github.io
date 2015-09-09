module.exports = function (grunt) {
  'use strict';

  grunt.config('postcss', {
    options: {
      map: true,
      processors: [
        require('autoprefixer')({
          browsers: ['> 5%', 'last 2 version', 'ie 8', 'ie 9']
        })
      ]
    },
    main: {
      src: ['<%= dist_css %>/main.css']
    }
  });
};
