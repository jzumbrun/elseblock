'use strict';

module.exports = function gettext(grunt) {
	
	// Load task
	grunt.loadNpmTasks('grunt-angular-gettext');
	grunt.initConfig({
	    nggettext_extract: {
	        pot: {
	            files: {
	                'po/templates.pot': ['app/templates/auth/*.html']
	            }
	        }
	    },
		nggettext_compile: {
			all: {
			  files: {
				'app/js/languages/en.js': ['po/*.po']
			  }
			}
		},
	});
};
