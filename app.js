const beachOrNah = angular.module('beachOrNah', ['ngRoute', 'ngResource']);



// ROUTES
beachOrNah.config(function ($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl: 'pages/home.html',
		controller: 'homeController'
	})

	.when('/forecast', {
		templateUrl: 'pages/forecast.html',
		controller: 'forecastController'
	})
})


// CONTROLLERS
beachOrNah.controller('homeController', ['$scope', function($scope) {

}]);

beachOrNah.controller('forecastController', ['$scope', function($scope) {

}]);