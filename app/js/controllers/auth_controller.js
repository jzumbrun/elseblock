'use strict';

app.controller('AuthController', ['$scope', '$http', '$location', '$routeParams',
	function($scope, $http, $location, $routeParams) {

		$scope.signin = function() {
			if ($scope.auth.user) $scope.redirect('/');
			
			$http.post('/signin', $scope.auth.signin).success(function(data) {

				if($scope.auth.create(data)){
					$scope.redirect('/');
				} else {
					$scope.signout('signin_failed', 'danger');
				}
									
			});
		};
		
		$scope.signup = function() {
			if ($scope.auth.user) $scope.redirect('/');
			
			$http.post('/signup', $scope.auth.signup)
			.success(function(data) {
				// If successful we assign the data to the global user model
				$scope.auth.create(data)
				// And redirect to the index page
				$scope.redirect('/');

			});
		};
		
		$scope.forgot = function() {
			
			$http.post('/forgot', $scope.auth.forgot)
			.success(function(data) {
				$scope.addMessage(data.message);
			});
		};
		
		$scope.reset = function() {
			
			$scope.auth.reset.email = $routeParams.email;
			$scope.auth.reset.reset_password = $routeParams.reset_password;
			
			$http.post('/reset', $scope.auth.reset)
			.success(function(data) {
				// If successful we assign the data to the global user model
				$scope.auth.create(data)
				// And redirect to the index page
				$scope.redirect('/');
			});
		};

	}
]);