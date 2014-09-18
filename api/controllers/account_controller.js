'use strict';
	
var models = require('../models'),
User = models.load('User');
		
module.exports = function (app) {
	
	
	/**
	 * Get Account
	 */
	app.get('/account', function (req, res) {
		
		User.findById( req.user._id, 
		function(err, user) {

			if (err || !user) { return res.status(422).send(err); }
			res.send(user);

		});
	});
	
	/**
	 * Save Account
	 */
	app.put('/account', function (req, res) {
		
		User.findById( req.user._id, 
		function(err, user) {

			// If something weird happens, abort.
			if (err || !user) { return res.status(422).send(err); }
			
			user.first_name = req.body.first_name;
			user.last_name = req.body.last_name;
			user.email = req.body.email;
			user.save(function(err) {
				if (err) { return res.status(422).send(err); }
				res.send({ token: user.token() });

			});


		});
	});
	
	/**
	 * Reset Password
	 */
	app.post('/account/password', function (req, res) {
		
		User.findById( req.user._id, 
		function(err, user) {

			// If something weird happens, abort.
			if (err || !user) { return res.status(422).send(err); }
			
			if(!user.passwordMatches(req.body.current_password)){
				return res.status(422).send({errors: {password: {message: 'current_password_wrong'}}});
			}
			
			if(!req.body.new_password){
				return res.status(422).send({errors: {password: {message: 'new_password_required'}}});
			}
			
			user.password = req.body.new_password;
			user.save(function(err) {
				if (err) { return res.status(422).send(err); }
				res.send({ message: 'password_reset' });
			});


		});
	});

};