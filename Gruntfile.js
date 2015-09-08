module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('build',
    'Build the application',
    [
      'sass:main',
      'postcss:main',
      'uglify:main',
      'imagemin:main'
    ]
  );
};
