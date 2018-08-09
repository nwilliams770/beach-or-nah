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

}]);

beachOrNah.controller('forecastController', ['$scope', '$resource', 'placeService', function($scope, $resource, placeService) {
	$scope.chosenPlace = placeService.place;
	let processedPlaceString = $scope.chosenPlace.split(", ");
	$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast?APPID=dfb10e52305b309e27a290c220279d28");

	$scope.weatherResult = $scope.weatherAPI.get({ q: `${processedPlaceString[0]},${processedPlaceString[2]}`, cnt: 1});

	
}]);

// DIRECTIVES
beachOrNah.directive('googleplace', function () {
	return {
		//binding this 
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			let options = {
				types: ["(cities)"]
			};

			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				// Explore this part more, why are we using $apply

				// need to do something here to properly handle countries othan than US, need country code
				let test = scope.gPlace.getPlace();

				scope.$apply(function () {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});