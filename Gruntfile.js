module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('html', 'Minify HTML', ['htmlmin:main']);
  grunt.registerTask('css', 'Compile, Minify and Prefix SCSS', ['sass:main', 'postcss:main']);
  grunt.registerTask('js', 'Concat and Minify JS', ['uglify:main']);
  grunt.registerTask('img', 'Minify IMG', ['imagemin:main']);

  grunt.registerTask('w', 'Watch the changes', ['watch']);

  grunt.registerTask('build',
    'Build the application',
    [
      'css',
      'js',
      'img',
      'shell:main',
      'html'
    ]
  );
};
