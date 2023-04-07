
var submitBtn = document.querySelector('#submit-btn');
var userChoices = document.querySelector('#user-choices');
var checkBox = document.querySelectorAll('input');
checkBox.type = 'checkbox';
var selected = [];
var searchTerm = selected.join();
dropDown = document.querySelector('#drop-down');
// open trip
apiKey = '5ae2e3f221c38a28845f05b6fc7cd900dbdfe52e778e3a8d9a518c53'
// open trip
apiUrl = 'http://api.opentripmap.com/0.1/ru/places/bbox?lon_min=-95.358421&lat_min=29.749907&lon_max=-95.372809&lat_max=29.859052&kinds=churches&format=geojson&apikey='
openTrip = 'https://api.opentripmap.com/0.1/en/places/radius?radius=32186&lon=-95.3632&lat=29.7662&kinds=' + searchTerm + '&rate=1&limit=50&apikey=' + apiKey;
var results = document.getElementById('results');

// api - opentrip documentation = https://opentripmap.io/docs

//datepicker
// $( function() {
//     $( "#datepicker" ).datepicker();
//   } );


// checkbox query
submitBtn.addEventListener('click', function(event) {
     event.preventDefault();
    //  var userDrop = dropDown.value;
    var location = dropDown.value;
    console.log(location);
    
    selected = [];
    for (i=0; i < 9; i++) {
       if (checkBox[i].checked) {
       selected.push(checkBox[i].name);
        
       } 
       
     }
    
     console.log(selected.join());
    
     var result = document.createElement('a')
     result.setAttribute('href', './search-results.html?location=' + location + '&selected=' + selected);
     result.textContent = "Click here for results";
    results.appendChild(result);
});

//   getData();
function getData() {
fetch(openTrip) 
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
    });
// api - opentrip documentation = https://opentripmap.io/docs

fetch(openTrip) 
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        for (var i = 0; i < 5; i++) {
            // This loops through the first five above and attaches to the next fetch
            var featureName = data.features[i].properties.name;
            var xid = data.features[i].properties.xid;
        
             // open trip api for detailed info
            var xidUrl = 'https://api.opentripmap.com/0.1/en/places/xid/' + xid + '?apikey=' + apiKey;
          fetch(xidUrl) 
          .then(function (response) {
              return response.json();
          })
          .then(function (xid) {
              console.log(xid)
      
            
    });        
};  
          });
        };

        //weather app javascript
        

var apiKey = "dc119b3a8e1dae4639fd809d8698a1d3";

var body = $('<body>');
var currentWx = document.getElementById('current-wx');
var foreWx = document.getElementById('fore-wx');



var list1 = document.getElementById('list-day1');
var list2 = document.getElementById('list-day2');
var list3 = document.getElementById('list-day3');

var dataArray =[];
var lat = "29.7662";
var lon = "-95.3632";


//dayjs to display date on screen
var now = dayjs();


function getCurrent() {
    

  
    var currentUrl =` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    
    fetch(currentUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("current")
        console.log(data);

        // object for current info
    var curData = {
        cityName: data.name,
        curIcon: data.weather[0].icon,
        curTemp: Math.round(data.main.temp),
        curHum: data.main.humidity,
        curWind: data.wind.speed,

    }  
  
    // dom traversal
    var inner = document.getElementById('inner');
    var curIconEl = document.getElementById('cur-icon')
    var curTempEl = document.getElementById('cur-temp');
    var curWindEl = document.getElementById('cur-wind');
    var curHumEl = document.getElementById('cur-hum');
    // var first = document.getElementById('first');
    curIconEl.src =  "https://openweathermap.org/img/wn/" + curData.curIcon + ".png";
    curTempEl.innerHTML = "Current Temp: " + curData.curTemp + "° F";
    curWindEl.innerHTML = "Winds: " + Math.round(curData.curWind) + " MPH";
    curHumEl.innerHTML = "Humidity: " + curData.curHum + "%";
    inner.innerHTML = data.name + "  "  + data.sys.country + "  " + dayjs().format('(M/D/YYYY)');
    // first.innerHTML = curData.cityName;
    
       
    });
}

getCurrent();
getForecast();
// gets api information for 5 day forecast and displays it on the screen

function getForecast() {
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;

    fetch(forecastUrl)
    .then(function (response) {
        if(response.ok) {
        return response.json();
        } else {
      
            alert("please try again");
        
        };
})
.then(function (newData) {
   
    for (i=0; i<24; i++) {
        // limits forecast data to three days all at three pm
        if (newData.list[i].dt_txt.includes("15:00:00")) {
            dataArray.push(newData.list[i]);
        }
    }
    return dataArray;
    
})
.then(function (data) {
    console.log("forecast");
    console.log(data);

   

        //lists for day 1
    var forIconEl1 = document.createElement('img');
    forIconEl1.setAttribute('id', 'icon1');    
    var forTempEl1 = document.createElement('li');
    var forHumEl1 = document.createElement('li');
    var forWindEl1 = document.createElement('li');
    list1.appendChild(forIconEl1);
    list1.appendChild(forTempEl1);
    list1.appendChild(forHumEl1);
    list1.appendChild(forWindEl1);

    forIconEl1.src =  "https://openweathermap.org/img/wn/" + data[0].weather[0].icon + ".png";
    var highTemp = "Temp: " + Math.round(data[0].main.temp) + "°F";
    var humForecast = "Humidity: " + data[0].main.humidity + "%" ;
    var windForecast = "Winds: " + Math.round(data[0].wind.speed) + " MPH";

    forTempEl1.textContent = highTemp;
    forHumEl1.textContent = humForecast;
    forWindEl1.textContent = windForecast;
    
        //lists for day 2
    var forIconEl2 = document.createElement('img');
    forIconEl2.setAttribute('id', 'icon2');    
    var forTempEl2 = document.createElement('li');
    var forHumEl2 = document.createElement('li');
    var forWindEl2 = document.createElement('li');
    list2.appendChild(forIconEl2);
    list2.appendChild(forTempEl2);
    list2.appendChild(forHumEl2);
    list2.appendChild(forWindEl2);
    
    forIconEl2.src =  "https://openweathermap.org/img/wn/" + data[1].weather[0].icon + ".png";
    var highTemp = "Temp: " + Math.round(data[1].main.temp) + "°F";
    var humForecast = "Humidity: " + data[1].main.humidity + "%";
    var windForecast = "Winds: " + Math.round(data[1].wind.speed) + " MPH";

    forTempEl2.textContent = highTemp;
    forHumEl2.textContent = humForecast;
    forWindEl2.textContent = windForecast;

    //lists for day three
    var forIconEl3 = document.createElement('img');
    forIconEl3.setAttribute('id', 'icon3');    
    var forTempEl3 = document.createElement('li');
    var forHumEl3 = document.createElement('li');
    var forWindEl3 = document.createElement('li');
    list3.appendChild(forIconEl3);
    list3.appendChild(forTempEl3);
    list3.appendChild(forHumEl3);
    list3.appendChild(forWindEl3);

    forIconEl3.src =  "https://openweathermap.org/img/wn/" + data[1].weather[0].icon + ".png";
    var highTemp = "Temp: " + Math.round(data[2].main.temp) + "°F";
    var humForecast = "Humidity: " + data[2].main.humidity + "%";
    var windForecast = "Winds: " + Math.round(data[2].wind.speed) + " MPH";

    forTempEl3.textContent = highTemp;
    forHumEl3.textContent = humForecast;
    forWindEl3.textContent = windForecast;
    
    });

};

    
