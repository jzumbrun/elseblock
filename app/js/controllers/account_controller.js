'use strict';

app.lazy.controller('AccountController', ['$scope', '$http', '$location', 'Account',
	function($scope, $http, $location, Account) {
		
		$scope.auth.require();

		$scope.account = [];
		
		$scope.index = function() {
			Account.get().$promise.
			then(function(account) {
			   $scope.account.index = account;
			});
		};
		
		$scope.update = function() {
			
			var account = new Account($scope.account.index);
			account.$update(function(data) {
				$scope.auth.create(data)
				$scope.addMessage('saved');
			});

		};
		
		$scope.password = function() {
			
			$http.post('/account/password', $scope.account.password)
			.success(function(data) {
				$scope.addMessage(data.message);
			});
		};

	}
]);