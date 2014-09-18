
module.exports = function IndexModel() {
    
    function js(type){
	
		var files = [];

		type = type || 'js';
		
		if(process.env.NODE_ENV == 'development'){
			var filester = require('../lib/filester'),
			flatten = require('flatten'),
			config = require('../config');

			// set files
			config.get(type).forEach(function(path){
				
				// directories
				if(path.indexOf('/**/*.js') > -1){
					files.push(filester(path.replace('/**/*.js','')));
					return;
				}
				
				//files
				files.push(path);
			});
			
			files = flatten(files);
		}
		return files;
		
	}
	
    return {
        js: js
    };
};