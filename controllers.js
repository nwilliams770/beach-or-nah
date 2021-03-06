beachOrNah.controller('homeController', ['$scope', 'placeService', function($scope, placeService) {
	    $scope.gPlace;
	
	    placeService.place = $scope.chosenPlace;
	    
	    $scope.$watch('chosenPlace', function() {
	        placeService.place = $scope.chosenPlace;
	    })
	
	}]);
	
	// TODO: If user refreshes, either cache chosen place or send them back to home
	beachOrNah.controller('forecastController', ['$scope', '$resource', '$log', '$cookies', 'placeService', function($scope, $resource, $log, $cookies, placeService) {
	    $scope.chosenPlace = placeService.place || "";
	    let processedPlaceString = $scope.chosenPlace.split(", ");
	
	    // Set/get cookie
	    if (processedPlaceString.length > 1) {
		    $cookies.put("chosenPlace", $scope.chosenPlace);
	    } else {
	        prevCity = $cookies.get("chosenPlace");
	        processedPlaceString = prevCity.split(", ");
	        $scope.chosenPlace = prevCity;
	    }

	    // API Call to Open Weather
	    $scope.weatherAPI = $resource("https://api.openweathermap.org/data/2.5/forecast?APPID=dfb10e52305b309e27a290c220279d28", {get: { method: "JSONP"}});
	    $scope.weatherAPI.get({ q: `${processedPlaceString[0]},${processedPlaceString[2]}`, cnt: 1})
	    .$promise.then(function (result) {
	        $scope.weatherResultRaw = result.list[0];
			processRawData($scope.weatherResultRaw);
			setFills();
	        $scope.error = false;
	    }).catch(function(err) {
	        if (err) {
	            $scope.error = true;
	            throw err;
	        }
	    });
	    setTimeout(animateFills, 2000);

		function animateFills() {
	        let thermo = $('.thermo');
	        let rain = $('.rain');
	        let pressure = $('.pressure');
	        let humidity = $('.humidity');
	        let wind = $('.windspeed');
	        let windDirection = $('.wind-direction-reading');
	
	        // windDirection.css({transform: rotateZ($scope.windDirection)});
	        windDirection.css("-webkit-transform", `rotateZ(${$scope.windDirection}deg)`);
	        angular.element(thermo).removeClass("active");
	        angular.element(rain).removeClass("active");
	        angular.element(pressure).removeClass("active");
	        angular.element(humidity).removeClass("active");
	        angular.element(wind).removeClass("active");
		}

		function setFills() {
	        $scope.thermometerFill = thermometerFill($scope.temp);
	        $scope.rainFill = rainFill($scope.rain);
	        $scope.pressureFill = pressureFill($scope.pressure);
	        $scope.windFill = windFill($scope.windSpeed);
	        $scope.humidityFill = humidityFill($scope.humidity);
		}

		function processRawData(data) {
	        $scope.weatherResultFiltered = [];

	        for (key in data) {
	            switch (key) {
	                case "dt":
	                    $scope.dateUnix = data[key];
	                    break;
	                case "rain":
	                    if (Object.keys(data[key]).length > 0) {
	                        $scope.rain = round(data[key]["3h"], 3);
	                    }
	                    break;
	                case "wind":
	                    if (Object.keys(data[key]).length > 0) {
	                        $scope.windSpeed = convertToMph(data[key].speed);
	                        $scope.windDirection = data[key].deg;
	                    }
	                    break;
	                case "main":
	                    $scope.temp = convertToFaherenheit(data[key].temp);
	                    $scope.tempMin = convertToFaherenheit(data[key].temp_min);
	                    $scope.tempMax = convertToFaherenheit(data[key].temp_max);
	                    $scope.pressure = data[key].pressure;
	                    $scope.humidity = data[key].humidity;
	                    break;
	                default:
	                    break;
	            }
	        }
		}
	    
	
	    // Unit Conversion Functions
	    function convertToFaherenheit(degK) {
	        return 1.8 * (degK - 273) + 32;
	    }
	    function convertToCelsius(degK) {
	        return degk - 273;
	    }
	    function convertToMph(speedMs) {
	        return (speedMs * 3600) / 1609.3; 
	    }
	    
	    function round(value, precision) {
	        var multiplier = Math.pow(10, precision || 1);
	        return Math.round(value * multiplier) / multiplier;
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
	
	    // 4% is minimum height and 80% max
	    function rainFill (rainfallMM) {
	        if (rainfallMM) {
	        // 4% height is when fill becomes visible; adding 4 to compensate
	        // Adding x3.5 to give a more dramatic fill
	            return 3.5 * (Math.round((rainfallMM / 203) * 100) + 4);
	        } else {
	            return 0;
	        }
	    }
	
	    // Scale for gauge attributes is from 0 to 67
	    function humidityFill (unadjustedHumidity) {
	        return Math.floor(unadjustedHumidity * 67 / 100);
	    }
	
	    // Scale for gauge attributes is from 0 to 67
	    // First calculate % of fill then return adjusted value
	    function pressureFill (pressureHpa) {
	        let unadjustedPercentageFill = Math.round((pressureHpa - 800) / 1060 * 100);
	        return 2 * Math.round((unadjustedPercentageFill * 67) / 100);
	    }
	
	    function windFill (windMph) {
	        let unadjustedPercentageFill = Math.round((windMph - 2) / 66 * 100);
	        return 2 * Math.round((unadjustedPercentageFill * 67) / 100);
	    }
	}]);	