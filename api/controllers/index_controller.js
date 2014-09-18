'use strict';
	
var IndexModel = require('../models/index_model');
	
module.exports = function (app) {

    app.get('/', function (req, res) {

		var model = new IndexModel();
		var js = model.js();
		res.render('index', {js: js});
    });

};