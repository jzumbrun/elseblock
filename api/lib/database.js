/**
 * A custom library to establish a database connection
 */
'use strict';

function Database() {
	
	var mongoose = require('mongoose'),
	config = require('../config');
	
    return {

        /**
         * Open a connection to the database
         * @param conf
         */
        connect: function () {
            
            mongoose.connect('mongodb://' + config.get('db').host + '/' + config.get('db').database);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open to ' + config.get('db').database);
            });
        }
    };
}

module.exports = new Database();