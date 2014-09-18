'use strict';

/*global app: true*/

var app = angular.module('app', [
  'config',
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'ngTagsInput',
  'gettext'
]);

app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$locationProvider', '$configProvider','$routeProvider','$httpProvider', function($controllerProvider, $compileProvider, $filterProvider, $provide, $locationProvider, $configProvider, $routeProvider, $httpProvider) {
	
	$locationProvider.hashPrefix('!');

	// save references to the providers
    app.lazy = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };

	$routeProvider.
		
		// HOME 
		when('/', {
			resolve: $configProvider.lazy({controller:'home'}),
			method: 'index',
			templateUrl: $configProvider.template('home/index.html'),
		}).
		
		// AUTH
		when('/signup', {
			templateUrl: $configProvider.template('auth/signup.html'),
		}).
	
		when('/signin', {
			templateUrl: $configProvider.template('auth/signin.html'),
		}).
	
		when('/forgot', {
			templateUrl: $configProvider.template('auth/forgot.html'),
		}).
	
		when('/reset/:email/:reset_password', {
			templateUrl: $configProvider.template('auth/reset.html'),
		}).
		
		// ACCOUNT
		when('/account', {
			resolve: $configProvider.lazy({controller:'account', models : ['account']}),
			method: "index",
			templateUrl: $configProvider.template('account/index.html'),
		}).
	
		when('/account/password', {
			templateUrl: $configProvider.template('account/password.html'),
		}).
	
		// Profile
		when('/profile', {
			resolve: $configProvider.lazy({controller:'profile', models : ['account']}),
			method: "index",
			templateUrl: $configProvider.template('profile/index.html'),
		}).

		// Admin
		when('/admin', {
			resolve: $configProvider.lazy({controller:'admin/dashboard'}),
			method: "index",
			templateUrl: $configProvider.template('admin/dashboard.html'),
		});

	$routeProvider.
		otherwise({redirectTo: '/'});
	
	$httpProvider.interceptors.push('authInterceptor');

}]);