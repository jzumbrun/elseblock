/*────────────────────────────────────────────────────────────────────────*\
│  Copyright (C) 2014 }else{ elseblock.com                          │
│                                ,,                                 │
│              mq.            `7MM                        ,pm       │
│                Mb             MM                      6M          │
│                YM    .gP"Ya   MM  ,pP"Ybd  .gP"Ya     M9          │
│                `"b._,M'   Yb  MM  8I   `" ,M'   Yb _.d"'          │
│                ,qd"'8M""""""  MM  `YMMMa. 8M"""""" `"bp.          │
│                6M   YM.    ,  MM  L.   I8 YM.    ,    Mb          │
│                M9    `Mbmmd'.JMML.M9mmmP'  `Mbmmd'    YM          │
│              md'                                        `bm       │
│                                                                   │
│  Licensed under the The MIT License (MIT);                        │
│  You may not use this file except in compliance with (MIT).       │
│  License located at http://opensource.org/licenses/MIT            │
\*────────────────────────────────────────────────────────────────────────*/
'use strict';

var _ = require('lodash'),
	config = require('../config');

/**
 * Mailer
 * Merge config defaults and send single or multiple mails
 *
 * @param (object) express app
 */
function Mailer(app){
	var self = this;

	self.res = {};
	self.options = {};
	
	var Mailgun = require('mailgun-js');
	self.mailgun = new Mailgun({apiKey: config.get('mailgun').key, domain: config.get('mailgun').domain});
	
	var __construct = function(){
		self.setRes();
	};

	/**
	 * Set Res
	 */
	self.setRes = function(){
		if(_.isUndefined(app.response)){
			self.res = app;
		}else{
			self.res = app.response.app;
		}
	};

	/**
	 * Set Defaults
	 * Prep the config defaults, send the message
	 *
	 * @param (literal) options
	 * @return (object) smtpTransport
	 */
	self.setDefaults = function(options){

		self.options = options;

		// always force messages to be an array for convenience
		if(!_.isArray(self.options.message)){
			self.options.message = [self.options.message];
		}

		// add mail if no parent dir is listed
		if(self.options.view.split('/').length){
			self.options.view = 'mail/' + self.options.view;
		}

	}

	/**
	 * Transport
	 * Loops through messages applying the view, then send mail
	 *
	 * @return (object) smtpTransport
	 */
	self.transport = function(){

		// we will always loop even on one message
		_.each(self.options.message, function(message, index){

			// render the view and set the output to the message html
			self.res.render(self.options.view, message.data, function(err, out){
					
				self.mailgun.messages().send({
				  from: config.get('mailgun').from,
				  to: message.to,
				  subject: message.subject,
				  text: out
				}, function (err, body) {
					if(err){
						 console.log(err);
					}
				});
			});
		});
	};

	/**
	 * Send
	 * Send the message using SMTP
	 *
	 * @param (literal) options
	 * @return (object) smtpTransport
	 */
	self.send = function(options){

		self.setDefaults(options);
		return self.transport();
	};

	__construct();

}

/**
 * Mailer
 *
 * @param (app) express app
 */
module.exports = function(app){
	return new Mailer(app);
};