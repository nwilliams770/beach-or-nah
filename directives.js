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
				scope.$apply(function () {
					model.$setViewValue(element.val());
				});
			});
		}
	};
});