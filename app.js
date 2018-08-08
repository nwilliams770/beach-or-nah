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
	$scope.gPlace;
}]);

beachOrNah.controller('forecastController', ['$scope', function($scope) {

}]);

// DIRECTIVES
beachOrNah.directive('googleplace', function () {
	return {
		//binding this 
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			let options = {
				types: []
			};

			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				scope.$apply(function () {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});