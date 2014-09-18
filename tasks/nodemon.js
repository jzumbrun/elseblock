'use strict';


module.exports = function nodemon(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-nodemon');

	// Options
	return {
		dev: {
			script: 'api/index.js',
			options: {
				ignore: ['node_modules/**', 'app/**'],
				ext: 'js, json'
			}
		}
	};
};
