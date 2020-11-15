var apiKey = '6e30fd10bfcb2aaa6c45d775afee83e7'
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1;
var currentDate = date.getDate();
var cityName = ''
var forecastDate = []
var forecastIcon = []
var forecastTemp = []
var forecastHumidity = []
var searchHistory = []
if (currentDate < 10) {
  currentDate = '0' + currentDate;
}
if (month < 10) {
  month = '0' + month;
}

function callCity(){
    
    var queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=' + apiKey
    
$.ajax({
    url: queryUrl,
    method: "GET"
})
.then(function(response){
    
    var iconId = response.weather[0].icon
    
    var iconSrc = "http://openweathermap.org/img/w/" + iconId + ".png"
    var city = response.name
    var temp = response.main.temp
    var humidity = response.main.humidity
    var speed = response.wind.speed
    var longitude = response.coord.lon
    var latitude = response.coord.lat
    $(".city").text(city)
    $("#currentDate").text(month+'/' + currentDate + '/'+ year)
    $("#currentIcon").attr('src', iconSrc)
    $("#currentTemp").text(temp)
    $("#currentHumidity").text(humidity + "%")
    $("#currentWind").text(speed + ' mph')

    // to get UV Index...
    var uvUrl = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey

    $.ajax({
        url: uvUrl,
        method: "GET"
    }).then(function(uv){
        
        var uvIndex = uv.value
        $("#currentUV").text(uvIndex)
        if(uvIndex > 10){
            $("#currentUV").attr('style', 'background: purple')
        } else if(uvIndex > 7){
            $("#currentUV").attr('style', 'background: red')
        } else if (uvIndex > 5){
            $("#currentUV").attr('style', 'background: orange')
        } else if(uvIndex > 2){
            $("#currentUV").attr('style', 'background: yellow')
        } else {
            $("#currentUV").attr('style', 'background: green')
        }
    })

})
}

function callForecast(){
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&appid=' + apiKey
    forecastDate = []
    forecastIcon = []
    forecastTemp = []
    forecastHumidity = []
    console.log(forecastUrl)
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function(cast){
            
            for(i = 0; i < cast.list.length; i ++){
            var castDate = cast.list[i].dt_txt
            console.log(castDate)
            console.log(castDate.indexOf('15:00:00'))   
            if(castDate.indexOf('15:00:00') !== -1){
               console.log(i) 
            
            var futureDate = castDate.split(" ")[0]
            var splitDate = futureDate.split('-')
            var castYear = splitDate[0]
            var castMonth = splitDate[1]
            var castDay = splitDate[2]
            var concatDate = castMonth + '/' + castDay + '/' + castYear
            var castIconId = cast.list[i].weather[0].icon
            var castTemp = cast.list[i].main.temp
            var castHumidity = cast.list[i].main.humidity
            
            forecastDate.push(concatDate)
            forecastIcon.push(castIconId) 
            forecastTemp.push(castTemp)
            forecastHumidity.push(castHumidity)
            
          } 
    
    }
    var dateElement = document.getElementsByClassName('date')
    var iconElement = document.getElementsByClassName('icon')
    var tempElement = document.getElementsByClassName('temperature')
    var humElement = document.getElementsByClassName('humidity')
    for(var x = 0; x < dateElement.length; x++){

    var forecastIUrl = "http://openweathermap.org/img/w/" + forecastIcon[x] + ".png"

    dateElement[x].innerHTML = forecastDate[x]
    iconElement[x].setAttribute('src', forecastIUrl)
    tempElement[x].innerHTML = forecastTemp[x]
    humElement[x].innerHTML = "Humidity: " + forecastHumidity[x] + '%'


     } 
    })
}

function init(){
    if(localStorage.getItem('cityName') !== 'null'){
        cityName = localStorage.getItem('cityName')
        callCity()
        callForecast()
    }
    
}

init()

//Search button click event...
$(".btn-search").on("click", function(e) {
    e.preventDefault()
    $('.form-control').empty()
    cityName = $('.form-control').val().trim()
    
    localStorage.setItem('cityName', cityName)
    callCity()
    callForecast()
        var newLi = $('<li>')
        var newBtn = $('<button>')
        newBtn.text(cityName)
        newBtn.attr('class', 'btn btn-light historyBtn')
        newBtn.attr('data-name', cityName)
        newLi.attr('class', 'nav-item')
        newLi.append(newBtn)
        $('#search-history').prepend(newLi)

        $('.historyBtn').on('click', function(target){
            target.preventDefault()
            console.log(target)
            cityName = target.currentTarget.getAttribute('data-name')
            localStorage.setItem('cityName', cityName)
            callCity()
            callForecast()
        })
        
    
    
})

$('#currentBtn').on('click', function(){
      
    $('#current').attr('style', 'display: block')
    $('#currentBtn').attr('class', 'nav-link active')
    $('#forecast').attr('style', 'display: none')
    $('#forecastBtn').attr('class', 'nav-link')   
    
})

$('#forecastBtn').on('click', function(){

    $('#current').attr('style', 'display: none')
    $('#currentBtn').attr('class', 'nav-link')
    $('#forecast').attr('style', 'display: block')
    $('#forecastBtn').attr('class', 'nav-link active')

})