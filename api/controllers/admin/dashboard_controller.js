'use strict';
	
module.exports = function (app) {

    app.get('/admin', function (req, res) {

		res.send({ greeting: 'hello' });
    });

};