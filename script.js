var cityList = $("#city-list");
var cities = [];

var APIKey = "2c954041f9c309faf27440e277080d3a";

function formatDate(date) {
    var date = new Date();
    console.log(date);
    var month = (date.getMonth() + 1);
    var day = date.getDate();

    var output = "(" + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + 
    date.getFullYear() + ")";

    return output;
}

init();

function init() {
    var storedCities = JSON.parse(localStorage.getItem('cities'));

    if (storedCities != null) {
        cities = storedCities;
    }

    createCities();
}

function setCities() {
    localStorage.setItem("cities", JSON.stringify(cities))
    console.log(localStorage);
}

function createCities() {


    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var li = $("<li>").text(city);
        li.attr("id", "listC");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");
        console.log(li);
        cityList.prepend(li);
    }

    if (!city){
        return
    } 
    else{
        getWeather(city)
    };
}

$("#add-city").on("click", function(event){
    event.preventDefault();

  var city = $("#city-input").val().trim();
  
  if (city === "") {
      return;
  }
  cities.push(city);
setCities();
createCities();
});


function getWeather(cityName){
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + APIKey; 

  $("#today-weather").empty();
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
      
    cityTitle = $("<h3>").text(response.name + " "+ formatDate());
    $("#today-weather").append(cityTitle);
    var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
    var cityTemperature = $("<p>").text("Temp: "+ TempetureToNum + " °F");
    $("#today-weather").append(cityTemperature);
    var cityWindSpeed = $("<p>").text("Wind: "+ response.wind.speed + " MPH");
    $("#today-weather").append(cityWindSpeed);
    var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
    $("#today-weather").append(cityHumidity);

  

  
      var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
          $.ajax({
          url: queryURL2,
          method: "GET"
      }).then(function(response5day) { 
          $("#boxes").empty();
          console.log(response5day);
          for(var i=0, j=0; j<=5; i=i+6){
              var read_date = response5day.list[i].dt;
              if(response5day.list[i].dt != response5day.list[i+1].dt){
                  var FivedayDiv = $("<div>");
                  FivedayDiv.attr("class","col-3 m-2 bg-primary")
                  var d = new Date(0); 
                  d.setUTCSeconds(read_date);
                  var date = d;
                  console.log(date);
                  var month = date.getMonth()+1;
                  var day = date.getDate();
                  var dayOutput = date.getFullYear() + '/' +
                  (month<10 ? '0' : '') + month + '/' +
                  (day<10 ? '0' : '') + day;
                  var Fivedayh4 = $("<h6>").text(dayOutput);
                  var imgtag = $("<img>");
                  var skyconditions = response5day.list[i].weather[0].main;
                  if(skyconditions==="Clouds"){
                      imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                  } else if(skyconditions==="Clear"){
                      imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                  }else if(skyconditions==="Rain"){
                      imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                }

                  var pTemperatureK = response5day.list[i].main.temp;
                  console.log(skyconditions);
                  var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                  var pTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                  var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");
                  FivedayDiv.append(Fivedayh4);
                  FivedayDiv.append(imgtag);
                  FivedayDiv.append(pTemperature);
                  FivedayDiv.append(pHumidity);
                  $("#boxes").append(FivedayDiv);
                  console.log(response5day);
                  j++;
                }
            }
        })
    })
}

$(document).on("click", "#listC", function() {
    var thisCity = $(this).attr("data-city");
    getWeather(thisCity);
  });