module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
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
