const beachOrNah = angular.module('beachOrNah', ['ngRoute', 'ngResource', 'ngSanitize']);

// SANITIZE RESOURCE 
beachOrNah.config(['$sceDelegateProvider', function($sceDelegateProvider) {

	$sceDelegateProvider.resourceUrlWhitelist([
	
	'self',
	
	'http://api.openweathermap.org/data/2.5/forecast?APPID=dfb10e52305b309e27a290c220279d28'
	
	]);
	
	}]);
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


// TODO: If user refreshes, either cache chosen place or send them back to home
beachOrNah.controller('forecastController', ['$scope', '$resource', '$log', 'placeService', function($scope, $resource, $log, placeService) {
	// API Call to Open Weather
	$scope.chosenPlace = placeService.place;
	let processedPlaceString = $scope.chosenPlace.split(", ");
	$scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast?APPID=dfb10e52305b309e27a290c220279d28", {get: { method: "JSONP"}});
	$scope.weatherAPI.get({ q: `${processedPlaceString[0]},${processedPlaceString[2]}`, cnt: 1})
	.$promise.then(function (result) {
		$scope.weatherResultRaw = result.list[0];
		$scope.weatherResultFiltered = []

		console.log("Weather result -------------")
		console.log($scope.weatherResultRaw);

		for (key in $scope.weatherResultRaw) {
			switch (key) {
				case "dt":
					$scope.dateRaw = $scope.weatherResultRaw[key];
					break;
				case "rain":

					if (Object.keys($scope.weatherResultRaw[key]).length > 0) {
						$scope.rain = $scope.weatherResultRaw[key]["3h"]
					}
					break;
				case "wind":
					if (Object.keys($scope.weatherResultRaw[key]).length > 0) {
						$scope.windSpeed = convertToMph($scope.weatherResultRaw[key].speed);
						$scope.windDirection = $scope.weatherResultRaw[key].deg;
					}
					break;
				case "main":
					$scope.temp = convertToFaherenheit($scope.weatherResultRaw[key].temp);
					$scope.tempMin = convertToFaherenheit($scope.weatherResultRaw[key].temp_min);
					$scope.tempMax = convertToFaherenheit($scope.weatherResultRaw[key].temp_max);
					$scope.pressure = $scope.weatherResultRaw[key].pressure;
					$scope.humidity = $scope.weatherResultRaw[key].humidity;
					break;
				default:
					break;
			}
		}

		console.log("Processed Scope -----------------------")
		console.log($scope);
		
	
		$scope.thermometerFill = thermometerFill($scope.temp);
		$scope.rainFill = rainFill($scope.rain);
		$scope.pressureFill = pressureFill($scope.pressure)
		$scope.windFill = windFill($scope.windSpeed)
		$scope.humidityFill = humidityFill($scope.humidity);
	}).catch(function(err) {
		if (err) {
			console.log(`Error: ${err}`)
			throw err;
		}
	});
	
	// 
	setTimeout(function () {
		let thermo = $('#thermo');
		let pressure = $('#pressure');
		let humidity = $('#humidity');
		let wind = $('#wind');
		let windDirection = $('#wind-direction');

		// windDirection.css({transform: rotateZ($scope.windDirection)});
		windDirection.css("-webkit-transform", `rotateZ(${$scope.windDirection}deg)`);
		angular.element(pressure).removeClass("active");
		angular.element(humidity).removeClass("active");
		angular.element(wind).removeClass("active");
	}, 3000);
	

	
	
	// Unit Conversion Functions
	function convertToFaherenheit(degK) {
		return Math.round(1.8 * (degK - 273) + 32);
	}
	function convertToCelsius(degK) {
		return Math.round(degk - 273);
	}
	function convertToMph(speedMs) {
		return Math.round((speedMs * 3600) / 1609.3); 
	}
	// SVG Display Functions
	// We want: 
	//  current temp // min and max (scale of 0 to 122 F)
	// humidity // scale of 0 to 100
	// pressure in hPa // scale of 800 to 1060
	// rain // may not be avail for all // scale of 203mm or 8 inches
	// wind speed // scale of 0 to 50 (current in meters / sec) // SWITCHED to 2 to 66 mph
	// wind direction // 0 to 360 //
	function thermometerFill (degF) {
		return Math.round((degF / 122) * 100);
	}

	function rainFill (rainfallMM) {
		if (rainfallMM) {
			return Math.round((rainfallMM / 203) * 100);
		} else {
			return 0;
		}
	}

	// Scale for gauge attributes is from 0 to 67
	function humidityFill (unadjustedHumidity) {
		return Math.round(unadjustedHumidity * 67 / 100);
	}

	// Scale for gauge attributes is from 0 to 67
	// First calculate % of fill then return adjusted value
	function pressureFill (pressureHpa) {
		let unadjustedPercentageFill = Math.round((pressureHpa - 800) / 1060 * 100);
		return 2 * Math.round((unadjustedPercentageFill * 67) / 100);
	}

	function windFill (windMph) {
		let unadjustedPercentageFill = Math.round((windMph - 2) / 66 * 100);
		console.log("WIND");
		console.log(2 * Math.round((unadjustedPercentageFill * 67) / 100));
		return 2 * Math.round((unadjustedPercentageFill * 67) / 100);
	}
	// $scope.temp = $scope.weatherResult.list[0].dt;
	// console.log("WEATHER!");
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