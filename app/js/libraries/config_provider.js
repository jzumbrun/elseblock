'use strict';

 /* global -confModule */
angular.module('config', []).provider('$config', $configProvider);

function $configProvider(){

	var self = this;
	self.template_prefix = null;
	self.files = [];

	self.template = function(url) {

		if(self.template_prefix === null){
			// template prefix
			self.template_prefix = '/templates/';
		}

		return self.template_prefix + url;
	
	};

	self.lazy = function(options){
		
		return {
				load: ['$q', '$rootScope', function ($q, $rootScope) {

					var files = [],
					loaded = 0,
					deferred = $q.defer();

					var filesLoaded = function(){
						loaded += 1;
						// resolve on the last one
						if(loaded == files.length){
							setTimeout(function(){
								$rootScope.$apply(function(){
									deferred.resolve();
								});
							},0);
						}
					};

					// models first then the controller
					if(options.models){
						options.models.forEach(function(model){
							files.push('/js/models/' + model + '_model.js');
						});
					}

					if(options.controller){
						files.push('/js/controllers/' + options.controller + '_controller.js');
					}
					
					files.forEach(function(url, index){

						// dont load js files we already loaded
						if(self.files.indexOf(url) === -1){
							self.files.push(url);
							jQuery.ajax({
								dataType: 'script',
								cache: true,
								url: url
							}).done(function(){
								filesLoaded();
							});
						} else { 
							filesLoaded();
						}
					});

					return deferred.promise;
				}]
			};
	};

	self.$get = function() {
		return {
			template: self.template,
			lazy: self.lazy
		};
	};

}