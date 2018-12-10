const beachOrNah = angular.module('beachOrNah', ['ngRoute', 'ngResource', 'ngSanitize']);

beachOrNah.filter('removeCommas', function() {
    return function(value) {
		let rounded = parseInt(value, 10); //convert to int
		return rounded.toString().replace(",", "");
    };
});

// SANITIZE RESOURCE 
beachOrNah.config(['$sceDelegateProvider', function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
	'self',
	'http://api.openweathermap.org/data/2.5/forecast?APPID=dfb10e52305b309e27a290c220279d28']);
}]);

// SERVICES
beachOrNah.service('placeService', function() {
	this.place = "";
});