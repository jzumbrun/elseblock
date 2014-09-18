'use strict';
/**
 * DashboardController
 *
 */
app.lazy.controller('DashboardController', ['$scope', '$http',
    function($scope, $http) {

        if (!$scope.hasRole('admin')) $scope.redirect('/');

        $http.get('/admin', {})
			.success(function(data) {
				$scope.greeting = data.greeting;
			});
    }
]);