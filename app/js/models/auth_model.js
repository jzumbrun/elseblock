'use strict';

// Session service for user variables
app.factory('Auth', ['$window',

	function($window) {
				
		var user = null,
		signup = {},
		signin = {},
		forgot = {},
		reset = {};
						
		function init(){
			var token = $window.localStorage.getItem('token');
			if(!token){return false;}
			
			api.user = JSON.parse(url_base64_decode(token.split('.')[1]));
		}
		
		function url_base64_decode(str) {
			var output = str.replace('-', '+').replace('_', '/');
			switch (output.length % 4) {
				case 0:
				  break;
				case 2:
				  output += '==';
				  break;
				case 3:
				  output += '=';
				  break;
				default:
				  $scope.signout();
			}
			return window.atob(output); //polyfill https://github.com/davidchambers/Base64.js
		}
		
		function create(data){
			if(!angular.isString(data.token)){return false;}
			api.user = JSON.parse(url_base64_decode(data.token.split('.')[1]));
			$window.localStorage.setItem('token', data.token);
			return true;
		}
		
		function clear(){
			api.user = null;
			api.signup = {};
			api.signin = {};
			api.forgot = {};
			api.reset = {};
			$window.localStorage.setItem('token', '');
		}

		function require(){
			if(!api.user || !api.user._id){
				console.log('hello');
				$window.location.href = '#!/signin'
			}
		}

		var api = {
			init : init,
			user : user,
			signup : signup,
			signin : signin,
			forgot : forgot,
			reset : reset,
			create : create,
			clear : clear,
			require : require
		};
		
		return api;
	}
]);

app.factory('authInterceptor', ['$rootScope', '$q', '$window',
	function($rootScope, $q, $window) {
		
		return {
			request: function(config) {
				config.headers = config.headers || {};
				if($window.localStorage.getItem('token')) {
					config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
				}
				return config;
			},
			responseError: function(rejection) {
				if(rejection.status === 401) {
					$rootScope.redirect('/signout');
				} 
				else if(rejection.status === 403) {
					$rootScope.addMessage('not_authorized');
				} 
				else if(rejection.status === 0) {
					$rootScope.addMessage('no_connection');
				} 
				else if(rejection.status === 422){
					
					if(rejection.data){
						if(rejection.data.errors){
							for (var key in rejection.data.errors) {
							   if (rejection.data.errors.hasOwnProperty(key)) {
								  var obj = rejection.data.errors[key];
								   if(obj.type == 'required'){
									   obj.message = obj.path + '_' + obj.type
								   }
								   
								   $rootScope.addMessage(obj.message, 'danger');
							   }
							}
						}
						else{
							$rootScope.addMessage(message, 'danger');
						}
					}
					else{
					$rootScope.addMessage('unknown_error', 'danger');
					}
					
				}
				else{
					$rootScope.addMessage(rejection.data, 'danger');
				}
				
				return $q.reject(rejection);
			}
		};
}]);