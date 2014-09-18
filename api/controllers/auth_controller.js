'use strict';

var models = require('../models'),
User = models.load('User'),
crypto = require('crypto');	

module.exports = function (app) {
	
	var mail = require('../lib/mailer')(app);
	
	/**
	 * Sign in
	 */
	app.post('/signin', function (req, res) {
		
		User.findOne({
			email: req.body.email
		}, function(err, user) {

			// If something weird happens, abort.
			if (err || !user) {
				return res.status(422).send({errors: {email: {message: 'email_not_found'}}});
			}
			
			if(!user.passwordMatches(req.body.password)){
				return res.status(422).send({errors: {password: {message: 'password_wrong'}}});
			}

			res.send({ token: user.token() });

		});

	});
	
	/**
	 * Sign up
	 */
	app.post('/signup', function (req, res) {
		
		var user = new User(req.body);

		user.roles = ['user'];
		user.save(function(err) {

			if (err) {
				return res.status(422).send(err);
			}
			
			res.send({ token: user.token() });
		});
	});
	
	/**
	 * Forgot
	 */
	app.post('/forgot', function (req, res) {
		
		User.findOne({
			email: req.body.email
		}, function(err, user) {

			// If something weird happens, abort.
			if (err || !user) {
				return res.status(422).send({errors: {email: {message: 'email_not_found'}}});
			}
			
			user.reset_password = crypto.randomBytes(16).toString('hex');
			user.save(function(err) {
				
				if (err) {
					return res.status(422).send(err);
				}
				
				mail.send({
					view: 'forgot',    
					message: {
						subject: 'Pickup Gamer Password Reset',
						to: user.email,
						data: {
							first_name: user.first_name, 
							url: 'http://' + req.headers.host+ '/#!/reset/' + user.email + '/' + user.reset_password}
					}
				});
				
				res.send({message: 'emailed_password_reset'});

			});


		});
	});
	
	/**
	 * Reset
	 */
	app.post('/reset', function (req, res) {
		User.findOne({
			email: req.body.email,
			reset_password: req.body.reset_password
		}, function(err, user) {

			// If something weird happens, abort.
			if (err || !user) {
				return res.status(422).send({errors: {email: {message: 'reset_password_wrong'}}});
			}
			
			user.reset_password = '';
			user.password = req.body.password;
			user.save(function(err) {
				if (err) {
					return res.status(422).send(err);
				}

				res.send({ token: user.token() });

			});

		});
	});
}