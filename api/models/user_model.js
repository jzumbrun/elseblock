'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require('../config'),
	jwt = require('jsonwebtoken'),
	crypto = require('crypto');

/**
 * A Validation function for password
 */
var validatePassword = function(password) {
	return password && password.length > 6;
};

/**
 * Find possible not used email
 */
var validateUniqueEmail = function(value, callback) {
  var User = mongoose.model('User');
  User.find({
    $and: [{
      email: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, user) {
    callback(err || user.length === 0);
  });
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	first_name: {
		type: String,
		trim: true,
		default: '',
		required : true
	},
	last_name: {
		type: String,
		trim: true,
		default: '',
		required : true
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		default: '',
		required : true,
		validate: [validateUniqueEmail, 'email_exists'],
		match: [/.+\@.+\..+/, 'email_invalid']
	},
	password: {
		type: String,
		default: '',
		validate: [validatePassword, 'password_length']
	},
	salt: {
		type: String
	},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	reset_password: {
		type: String
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (validatePassword(this.password)) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.passwordMatches = function(password) {	
	return validatePassword(password) && this.password === this.hashPassword(password);
};

/**
 * Create instance method for a token
 */
UserSchema.methods.token = function() {	
	// We are sending the profile inside the token
	return jwt.sign({
		_id: this._id,
		first_name: this.first_name,
		last_name: this.last_name,
		email: this.email, 
		roles: this.roles, 

	}, config.get('secret'), { expiresInMinutes: 60*5 });
};

mongoose.model('User', UserSchema);