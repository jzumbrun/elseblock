'use strict';


module.exports = function uglify(grunt) {
	
	var config = require('../api/config/production');

	// Load task
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Options
	return {
		my_target: {
		  files: {
			'app/js/min.js': config.js
		  }
		}
	};
};
