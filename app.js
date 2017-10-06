var map;
var latLong = {
  lat: 39.7392360,
  lng: -104.9902510
}
var symbol = {
  clear_day: "./weather_icons/PNG/PNG Version 1/001lighticons-02.png",
  clear_night: "./weather_icons/PNG/PNG Version 1/001lighticons-03.png",
  rain: "./weather_icons/PNG/PNG Version 1/001lighticons-18.png",
  snow: "./weather_icons/PNG/PNG Version 1/001lighticons-23.png",
  sleet: "./weather_icons/PNG/PNG Version 1/001lighticons-39.png",
  wind: "./weather_icons/PNG/PNG Version 1/001lighticons-06.png",
  fog: "./weather_icons/PNG/PNG Version 1/001lighticons-05.png",
  cloudy: "./weather_icons/PNG/PNG Version 1/001lighticons-25.png",
  partly_cloudy_day: "./weather_icons/PNG/PNG Version 1/001lighticons-08.png",
  partly_cloudy_night: "./weather_icons/PNG/PNG Version 1/001lighticons-09.png"
}
$(document).ready(function() {
  getGolfCourse();
  initMap(latLong)
})

function initMap(cords) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: cords,
    zoom: 14
  });
}

function getGolfCourse() {
  $.get("https://cors-anywhere.herokuapp.com/https://api.swingbyswing.com/v2/courses/search_by_location?lat=39.7392360&lng=-104.9902510&radius=20&active_only=yes&hole_count=18&order_by=distance_from_me_miles&from=1&limit=20&access_token=cb9c260f-9df9-47a3-9ed9-a8af13e66281").then(function(data) {

    for (var i = 0; i < data.courses.length; i++) {
      var curloc = []
      curloc.push(data.courses[i].location.lat)
      curloc.push(data.courses[i].location.lng)
      curloc.push(data.courses[i].name)
      $(".courses").append($("<option></option>").attr("value", curloc).text(data.courses[i].name));
    }
  })
}

$(".input").click(function(event) {
  event.preventDefault();
  var $obj = $('.courses option:selected').val()
  var object = $obj.split(',')

  var lat = object[0];
  var lng = object[1];

  getForecast(lat, lng);
  updateMap(lat, lng);
})

function getForecast(lat, lng) {
  $.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/20758fa1826a1972a30b3b488442072f/" + lat + ',' + lng).then(function(weather) {
    var iconUrl = weather.currently.icon
    var image = document.getElementById('symbol')
    iconUrl = iconUrl.split('-').join('_');
    var symbolTag = document.getElementById("symbol")
    symbolTag.src = symbol[iconUrl]
    image.classList.remove('hide')
    var curWeather = []
    curWeather.push(weather.currently.icon)
    curWeather.push(weather.currently.temperature)
    curWeather.push(weather.currently.precipProbability)
    curWeather.push(weather.currently.windSpeed)

    for (var i = 0; i < curWeather.length; i++) {
      //  $(".forecastIcon").text(curWeather[0])
      $(".forecastTemp").text("Current Temperature:" +
        " " + curWeather[1] + "°")
      $(".forecastPrecipProbability").text("Chance of Rain:" +
        " " + curWeather[2] + "%")
      $(".forecastWindSpeed").text("Wind Speed:" +
        " " + curWeather[3] + " " + "MPH")
    }
  })
}

function updateMap(lat, lng) {
  var myLatLng = new google.maps.LatLng(lat, lng);
  map.setCenter(myLatLng);
}
