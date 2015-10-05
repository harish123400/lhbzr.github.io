module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    src: 'src',
    src_html: '<%= src %>/html',
    src_css: '<%= src %>/css',
    src_js: '<%= src %>/js',
    src_img: '<%= src %>/img',
    dist: 'dist',
    dist_html: '',
    dist_css: '<%= dist %>/css',
    dist_js: '<%= dist %>/js',
    dist_img: '<%= dist %>/img'
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('html', ['htmlmin:main']);
  grunt.registerTask('css', ['sass:main', 'postcss:main']);
  grunt.registerTask('js', ['uglify:main']);
  grunt.registerTask('img', ['imagemin:main']);
  grunt.registerTask('w', ['watch']);
  grunt.registerTask('build', ['css', 'js', 'img', 'html']);
};
