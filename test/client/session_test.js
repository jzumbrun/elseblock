'use strict';

(function() {
	// Session controller Spec
	describe('SessionController', function() {
		// Initialize global variables
		var SessionController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Load the main application module
		beforeEach(module('app'));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$httpBackend_) {
			
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			// Initialize the Session controller
			SessionController = $controller('SessionController', {
				$scope: scope,
			});
		}));

// 		it('$scope.signin() should fail with a bad user and password', function() {
			
// 			// Test expected GET request
// 			$httpBackend.expectPOST('/signin').respond(200, 'Frank');

// 			scope.signin();
// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.message.danger).toEqual('signin_failed');
// 		});

// 		it('$scope.signin() should fail to log in with nothing', function() {
// 			// Test expected POST request
// 			$httpBackend.expectPOST('/signin').respond(400, {
// 				'message': 'Missing credentials'
// 			});

// 			scope.signin();
// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.message.danger).toEqual('Missing credentials');
// 		});

// 		it('$scope.signin() should fail to log in with wrong credentials', function() {
// 			// Foo/Bar combo assumed to not exist
// 			scope.authentication.user = 'Foo';
// 			scope.credentials = 'Bar';

// 			// Test expected POST request
// 			$httpBackend.expectPOST('/auth/signin').respond(400, {
// 				'message': 'Unknown user'
// 			});

// 			scope.signin();
// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.error).toEqual('Unknown user');
// 		});

// 		it('$scope.signup() should register with correct data', function() {
// 			// Test expected GET request
// 			scope.session.signup = {
// 				first_name: 'Frank',
// 				last_name: 'Stank',
// 				email: 'frank@pickupgamer.com',
// 				password: '123456'
// 			};
// 			$httpBackend.expectPost('/signup').respond(200, '');

// 			scope.signup();
// 			$httpBackend.flush();

// 			// test scope value
// 			expect(scope.session.user).toBe('Frank');
// 			expect(scope.message).toEqual({});
// 			expect($window.localStorage.getItem('token').toBeTruthy();
// 			expect($location.url()).toBe('/signin');
// 		});

// 		it('$scope.signup() should fail to register with duplicate Username', function() {
// 			// Test expected POST request
// 			$httpBackend.when('POST', '/auth/signup').respond(400, {
// 				'message': 'Username already exists'
// 			});

// 			scope.signup();
// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.error).toBe('Username already exists');
// 		});
	});
}());