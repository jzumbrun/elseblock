'use strict';

module.exports = function deploy(grunt) {

	grunt.task.registerTask('deploy-commit', 'Commiting deploy.', function() {
		grunt.task.requires('uglify');

		grunt.util.spawn({
			cmd: 'git',
				args: ['commit', '-am', '"Deploying Commit"'],
				opts : {stdio: 'inherit'}
			}, function(error, result, code) {
				// All done, continue to the next tasks
				grunt.run.task('deploy-push-master');
		});

	});

	grunt.task.registerTask('deploy-push-master', 'Pushing to master.', function() {
		grunt.task.requires('deploy-commit');

		grunt.util.spawn({
			cmd: 'git',
				args: ['push', 'origin', 'master'],
				opts : {stdio: 'inherit'}
			}, function(error, result, code) {
				// All done, continue to the next tasks
				grunt.run.task('deploy-push-production');
		});

	});

	grunt.task.registerTask('deploy-push-production', 'Pushing to production.', function() {
		grunt.task.requires('deploy-push-master');

		grunt.util.spawn({
			cmd: 'git',
				args: ['push', 'origin', 'production'],
				opts : {stdio: 'inherit'}
			}, function(error, result, code) {
				// All done, continue to the next tasks
				done();
		});

	});

};
