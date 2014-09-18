'use strict';

function Config() {
    
	var config = {},
	_ = require('lodash'),
	production = require('./production'),
	development = require('./development');
	
	function init(app) {
		
		if(app.get('env') === 'development') {
			config = _.merge(production, development);
		}
		else {
			config = production;
		}
		
    }
	
	function set(item, value){
		return config[item] = value;
	}
	
	function get(item){
		if(item){
			return config[item];
		}
		return config;
	}
    
	return {
		init: init,
		set: set,
		get : get
	}
}

module.exports = new Config();