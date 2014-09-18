'use strict';

function Model() {
	
	var models = {},
	mongoose = require('mongoose');

	// Load the model object
	function load(model){
		if(!models[model]){
			require('./' + model.toLowerCase() + '_model');
			models[model] = mongoose.model(model);
		}
		
		return models[model];
	}
	
    return {
        load: load
    };
}

module.exports = new Model();