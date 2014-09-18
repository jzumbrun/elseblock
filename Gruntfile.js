'use strict';

module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // Register group tasks
    grunt.registerTask('default', ['nodemon']);
	grunt.registerTask('deploy', ['uglify', 'deploy-commit']);
    grunt.registerTask('test', ['jshint', 'mochacli']);

};
