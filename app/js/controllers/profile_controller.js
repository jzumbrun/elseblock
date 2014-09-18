'use strict';

app.lazy.controller('ProfileController', ['$scope', '$http', '$location', 'Account',
	function($scope, $http, $location, Account) {
		$scope.auth.require();

		$scope.profile = [];
		
		$scope.index = function() {
			Account.get().$promise.
			then(function(account) {
			   $scope.profile.index = account;
			});
		};
	}
]);