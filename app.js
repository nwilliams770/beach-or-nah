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

// SERVICES
beachOrNah.service('placeService', function() {
	this.place = "";
})

// CONTROLLERS
beachOrNah.controller('homeController', ['$scope', 'placeService', function($scope, placeService) {
	$scope.gPlace;

	placeService.place = $scope.chosenPlace;
 
	$scope.$watch('chosenPlace', function() {
		placeService.place = $scope.chosenPlace;
	})

	console.log($scope);
}]);

beachOrNah.controller('forecastController', ['$scope', 'placeService', function($scope, placeService) {
	$scope.chosenPlace = placeService.place;

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
				// Explore this part more, why are we using $apply
				scope.$apply(function () {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});