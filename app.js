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

	.otherwise('/')
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

beachOrNah.controller('forecastController', ['$scope', '$resource', '$log', '$promise', 'placeService', function($scope, $resource, $log, $promise, placeService) {
	$scope.chosenPlace = placeService.place;
	let processedPlaceString = $scope.chosenPlace.split(", ");
	$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast?APPID=dfb10e52305b309e27a290c220279d28");

	// $scope.weatherResult = $scope.weatherAPI.get({ q: `${processedPlaceString[0]},${processedPlaceString[2]}`, cnt: 1});
	$scope.weatherAPI.get({ q: `${processedPlaceString[0]},${processedPlaceString[2]}`, cnt: 1}).$promise.then(function (data) {
		$scope.weatherResult = data;
	})

	// We want: 
	//  current temp // min and max (scale of 0 to 122 F)
	// humidity // scale of 0 to 100
	// pressure in hPa // scale of 960 to 1060
	// rain // may not be avail for all // scale of 0 to 5
	// wind speed // scale of 0 to 50 (current in meters / sec)
	// wind direction // 0 to 360 //
	$scope.convertToFaherenheit = function(degK) {
		return Math.round(1.8 * (degK - 273) + 32);
	}
	$scope.convertToCelsius = function (degK) {
		return degk - 273;
	}

	// $scope.temp = $scope.weatherResult.list[0].dt;
	// console.log("WEATHER!");
	$log.log($scope.weatherResult);
	// $scope.thermoPercentage = $scope.weatherResult



}]);

// DIRECTIVES
beachOrNah.directive('googleplace', function () {
	return {
		//binding this 
		require: 'ngModel',
		link: function(scope, element, attrs, model) {
			// current US cities only due to lack of processing country codes for API request
			let options = {
				types: ['(cities)'],
  				componentRestrictions: {country: "us"}
			};

			scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

			google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
				// Explore this part more, why are we using $apply

				let test = scope.gPlace.getPlace();

				scope.$apply(function () {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});