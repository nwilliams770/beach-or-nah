# beach-or-nah 🏖🌴🌊
[Live](https://nwilliams770.github.io/beach-or-nah/)

Beach or Nah? is a dynamic single-page AngularJS application for users to check detailed forecasts using the [openweathermap.org](https://openweathermap.org/) API.

## Features
- Autocomplete location form using Google Maps API
- Ability to set and get cookie of most recent query
- CSS-animated homepage
- SVG forecast interface

## Technologies
- AngularJS
- HTML5
- CSS3
- Sass
- ES6
- jQuery
- Google Places API
- openweather.org API

## Future Improvements
Currently, a cookie is stored when the user makes a forecast query and retrieved when there is no query (e.g. our user refreshed the page). As opposed to storing the query in a cookie, resulting in a second GET request for the same query, a custom service could be created that stores the initial HTTP response in localstorage thereby reducing erroneous HTTP requests and the need for a cookie.

![Beach or Nah Demo gif](https://github.com/nwilliams770/beach-or-nah/blob/gh-pages/assets/static/demo.gif)

[Live](https://nwilliams770.github.io/beach-or-nah/)
