'use strict';
/**
 * AppController
 *
 */
app.controller('AppController', ['$window', '$rootScope', '$scope', '$route', '$config', '$timeout', '$location', 'gettextCatalog', 'Auth',
    function($window, $rootScope, $scope, $route, $config, $timeout, $location, gettextCatalog, Auth) {
        $scope.auth = Auth;
        $scope.auth.init();
        $rootScope.messages = [];
        /* Redirect
         * Redirect to another route
         *
         */
        $scope.redirect = function(route) {
            // default we load route content
            setTimeout(function() {
                $scope.$apply(function() {
                    if(route === 'back') {
                        $window.history.back();
                    } else {
                        $location.path(route);
                    }
                });
            }, 0);
        };
        /* Reload
         * Reload the route
         *
         */
        $scope.reload = function() {
            $route.reload();
        };
        /* Set
         * Set a value to the scope
         *
         */
        $scope.set = function(set, value, apply) {
            apply = apply || false;
            if(apply) {
                $scope.$apply(function() {
                    $scope[set] = value;
                });
            } else {
                $scope[set] = value;
            }
        };
        /* Set Root
         * Set a value to the scope
         *
         */
        $scope.setRoot = function(set, value, apply) {
            apply = apply || false;
            if(apply) {
                $rootScope.$apply(function() {
                    $rootScope[set] = value;
                });
            } else {
                $rootScope[set] = value;
            }
        };
        /* Partial
         * Sets partial url
         *
         */
        $scope.partial = function(partial) {
            // defalt we load route content
            if(angular.isUndefined(partial) && $route.current.partial !== '') {
                return $route.current.partial;
            }
            return $config.template(partial + '.html');
        };
		
        /* Add Message
         *
         */
        $rootScope.addMessage = function(body, type) {
            $rootScope.messages.push({
                body: body,
                type: type || 'info'
            });
			
            $timeout(function() {
                $scope.messages.shift();
            }, 4000);
        };
		
        /* Signout
         *
         */
        $scope.signout = function(error) {
            if(error) {
                $scope.addMessage(error);
            } else {
                $scope.addMessage(gettextCatalog.getString('signed_out'));
            }
            $scope.auth.clear();
            $scope.redirect('/');
        };

        /* Has Role
         *
         */
        $scope.hasRole = function(role) {
            return (angular.isObject($scope.auth.user) && angular.isArray($scope.auth.user.roles) && $scope.auth.user.roles.exists(role));
        };
        
        Object.defineProperty(Array.prototype, "remove", {
            enumerable: false,
            value: function(remove) {
                this.splice(this.indexOf(remove), 1);
            }
        });

        Object.defineProperty(Array.prototype, "exists", {
            enumerable: false,
            value: function(exists) {
                return this.indexOf(exists) > -1;
            }
        });
    }
]);