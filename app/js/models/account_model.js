'use strict';

// Users service used for communicating with the users REST endpoint
app.lazy.factory('Account', ['$resource',
	function($resource) {
		return $resource('account', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);