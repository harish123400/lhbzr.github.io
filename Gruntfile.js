module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    src: 'src',
    src_css: '<%= src %>/css',
    src_js: '<%= src %>/js',
    src_img: '<%= src %>/img',
    dist: 'dist',
    dist_css: '<%= dist %>/css',
    dist_js: '<%= dist %>/js',
    dist_img: '<%= dist %>/img'
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('html', 'Minify HTML', ['htmlmin:main']);
  grunt.registerTask('css', 'Compile, Minify and Prefix CSS', ['sass:main', 'postcss:main']);
  grunt.registerTask('js', 'Concat and Minify JS', ['uglify:main']);
  grunt.registerTask('img', 'Minify IMG', ['imagemin:main']);

  grunt.registerTask('w', 'Watch the changes on HTML, CSS, JS and IMG', ['watch']);

  grunt.registerTask('build',
    'Build the entire application',
    [
      'css',
      'js',
      'img',
      'shell:build',
      'html'
    ]
  );
};
