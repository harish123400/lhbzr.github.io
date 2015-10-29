module.exports = function (grunt) {
  'use strict';

  grunt.config('watch', {
    html: {
      files: ['<%= src_html %>/**/*.html'],
      tasks: ['html']
    },
    css: {
      files: ['<%= src_css %>/**/*.scss'],
      tasks: ['css']
    },
    js: {
      files: ['<%= src_js %>/**/*.js'],
      tasks: ['js']
    },
    svg: {
      files: ['<%= src_img %>/sprites/*.svg'],
      tasks: ['svg']
    }
  });
};
