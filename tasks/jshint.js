'use strict';


module.exports = function jshint(grunt) {
	
	var config = require('../api/config/production');

	// Load task
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Options
	return {
		files: config.js,
		options: {
		    jshintrc: 'client/app/js/.jshintrc'
		}
	};
};
