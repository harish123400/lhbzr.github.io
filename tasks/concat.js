module.exports = function (grunt) {
  'use strict';

  grunt.config('concat', {
    util: {
      src: [
        '<%= src_js %>/util/shader/CopyShader.js',
        '<%= src_js %>/util/shader/DotScreenShader.js',
        '<%= src_js %>/util/shader/RGBShiftShader.js',
        '<%= src_js %>/util/processing/EffectComposer.js',
        '<%= src_js %>/util/processing/RenderPass.js',
        '<%= src_js %>/util/processing/MaskPass.js',
        '<%= src_js %>/util/processing/ShaderPass.js'
      ],
      dest: '<%= src_js %>/util.js'
    }
  });
};
