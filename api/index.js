#!/bin/env node
/*────────────────────────────────────────────────────────────────────────*\
│  Copyright (C) 2014 }else{ elseblock.com                                 │
│                                ,,                                        │
│              mq.            `7MM                        ,pm              │
│                Mb             MM                      6M                 │
│                YM    .gP"Ya   MM  ,pP"Ybd  .gP"Ya     M9                 │
│                `"b._,M'   Yb  MM  8I   `" ,M'   Yb _.d"'                 │
│                ,qd"'8M""""""  MM  `YMMMa. 8M"""""" `"bp.                 │
│                6M   YM.    ,  MM  L.   I8 YM.    ,    Mb                 │
│                M9    `Mbmmd'.JMML.M9mmmP'  `Mbmmd'    YM                 │
│              md'                                        `bm              │
│                                                                          │
│  Licensed under the The MIT License (MIT);                               │
│  You may not use this file except in compliance with (MIT).              │
│  License located at http://opensource.org/licenses/MIT                   │
\*────────────────────────────────────────────────────────────────────────*/
'use strict';

/**
 *  Define the sample application.
 */
function Main() {
	
	require('./lib/helpers');
	
    var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	favicon = require('static-favicon'),
	logger = require('morgan'),
	parser = require('body-parser'),
	database = require('./lib/database'),
	config = require('./config'),
	jwt = require('express-jwt'),
	ipaddress = '127.0.0.1',
	port = 8000,
	is_openshift = false,
	root = '',
	app = {};

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    function setupVariables() {
		root = process.env.PWD;

		process.env.NODE_ENV = 'production'
		if(process.env.USER !== 'production-user-name'){
			process.env.NODE_ENV = 'development';
		}
		
        //  Set the environment variables we need.
        ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
        port      = process.env.OPENSHIFT_NODEJS_PORT || 8000,
        is_openshift = process.env.OPENSHIFT_APP_NAME || false;

        if (typeof ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ localhost - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using localhost');
            ipaddress = "localhost";
        };
    }

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    function terminator(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    }


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    function setupTerminationHandlers(){
        //  Process on exit and signals.
        process.on('exit', function() { terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { terminator(element); });
        });
    }


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    function initializeServer() {
        app = express();
        config.init(app);

		app.use(express.static(root + '/app'));
		app.use(favicon());
		app.use(logger('dev'));
		app.use(parser.json());
		app.use(parser.urlencoded());
		
		// We are going to protect routes with JWT
		app.use(jwt({secret: config.get('secret')}).unless({path: config.get('open_paths')}));
		
		// protect admin with admin role
		app.use(/^\/admin/, function (req, res, next){
			if(req.user && req.user.roles && req.user.roles.exists('admin')){ return next(); }
			res.status(401).send('unauthorized');
		});

		// load controllers
		fs.readdirSync(__dirname + '/controllers').forEach(function(file) {
			if(file.indexOf('.') > 1){
				require(__dirname + '/controllers/' + file)(app);
			}
			else{ // let only allow one nested level
				fs.readdirSync(__dirname + '/controllers/' + file).forEach(function(nested_file) {
					require(__dirname + '/controllers/' + file + '/' + nested_file)(app);
				});
			}
			
		});
		
		// view engine setup
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'ejs');

		// error handlers
		errors(app);
		
		// connect to database
		database.connect();
    }
	
	/**
     *  Set Error Handlers
     */
	function errors(){
		
		app.use(function(err, req, res, next){
		  if (err.constructor.name === 'UnauthorizedError') {
			res.status(401).send('unauthorized');
		  }
		});
		
		// catch 404 and forward to error handler
		app.use(function(req, res, next) {
			var err = new Error('not_found');
			err.status = 404;
			next(err);
		});
		
		// development error handler
		// will print stacktrace
		if (app.get('env') === 'development') {
			app.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.send({
					message: err.message,
					error: err
				});
			});
		}
		
		// production error handler
		// no stacktraces leaked to user
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: {}
			});
		});
	}

    /**
     *  Initializes the sample application.
     */
    function initialize() {
        setupVariables();
        setupTerminationHandlers();

        // Create the express server and routes.
        initializeServer();
    }


    /**
     *  Start the server (starts up the sample application).
     */
    function start() {
        //  Start the app on the specific interface (and port).
        
        if(is_openshift){
            app.listen(port, ipaddress);
        }
        else{
            app.listen(port, function (err) {
            	console.log('App started at %s on %s:%d ...', Date(Date.now() ), ipaddress, port);
        	});
        }
 
    }
	
	return {
		initialize : initialize,
		start: start
	};
}

/**
 *  main():  Main code.
 */
var main = new Main();
main.initialize();
main.start();