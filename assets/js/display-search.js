
// Initialization of variables 
const submitBtnEl = document.querySelector("#submit-btn");
const dropDown = document.getElementById("drop-down");
const checkBox = document.querySelectorAll('input');
const resultTextElement = document.getElementById("result-text");
const resultContentEl = document.querySelector('#result-content');

let map;

apiKey = '5ae2e3f221c38a28845f05b6fc7cd900dbdfe52e778e3a8d9a518c53'


function handleSearchFormSubmit(event) {

    // This function is the event listener of the submit button when clicked 

    event.preventDefault();

    let location = dropDown.value;
    let selected = [];

    if (selected) {
        for (i = 0; i < 9; i++) {
            if (checkBox[i].checked) {
                selected.push(checkBox[i].name);
            }
    
        }
    }

    const selectedOption = dropDown.options[dropDown.selectedIndex];
    const textContent = selectedOption.textContent;
    resultTextElement.textContent = textContent;

    getData(location, selected);
    selectMap(location);

}

function getParams() {

    // This function gets the search params out of the URL and converts it in to an array
    var searchParamsArr = document.location.search;

    if (searchParamsArr) {
        var userLocation = searchParamsArr.split('location=')[1];
        userLocation = userLocation.substring(0, 24);
        var userSelected = searchParamsArr.split('selected=')[1];

        getData(userLocation, userSelected);

        let selectedOptionText = ''

        for (let i = 0; i < dropDown.options.length; i++) {
            if (userLocation === dropDown.options[i].value) {
                selectedOptionText = dropDown.options[i].textContent;
            }
        }

        resultTextElement.textContent = selectedOptionText;
    }
}

function addMarkers(resultObj, map) {

    // This function adds markers to the map to be displayed

    // resultObj: selected object
    // map: map element 

    var marker = new google.maps.Marker({
        position:{lat:resultObj.point.lat, lng:resultObj.point.lon},
        map: map
    })

    var infoWindow = new google.maps.InfoWindow({
        content: '<h2 style="color: red; font-size: 20px; font-weight: bold;">' + resultObj.name + '</h2>'
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    } )
}

function printResults(resultObj) {

    // This function generates <div> elements that holds the result content

    // resultObj: object selected

   
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');
  
    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);
  
    var titleEl = document.createElement('h3');
    titleEl.textContent = resultObj.title;
  
    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML =
      '<strong>Name:</strong> ' + resultObj.name + '<br/>';
    
    if (resultObj.address.house_number) {
      bodyContentEl.innerHTML +=
      '<strong>Address:</strong> ' + resultObj.address.house_number + ' ' + resultObj.address.road + '<br/>';
    } else {
        bodyContentEl.innerHTML +=
        '<strong>Address:</strong> ' + resultObj.address.road + '<br/>';
    }    
    if (resultObj.kinds) {
      bodyContentEl.innerHTML +=
        '<strong>Kinds:</strong> ' + resultObj.kinds + '<br/>';
    } else {
      bodyContentEl.innerHTML +=
        '<strong>Kinds:</strong> N/A';
    }
  
    if (resultObj.wikipedia_extracts) {
      bodyContentEl.innerHTML +=
        '<strong>Description:</strong> ' + resultObj.wikipedia_extracts.text;
    } else {
      bodyContentEl.innerHTML +=
        '<strong>Description:</strong>  No description for this entry.';
    }
  
    if (resultObj.wikipedia) {
        var linkButtonEl = document.createElement('a');
        linkButtonEl.textContent = 'Read More';
        linkButtonEl.setAttribute('href', resultObj.wikipedia);
        linkButtonEl.classList.add('btn', 'btn-dark');
    
        resultBody.append(titleEl, bodyContentEl, linkButtonEl);
    } else if (resultObj.url) {
        var linkButtonEl = document.createElement('a');
        linkButtonEl.textContent = 'Read More';
        linkButtonEl.setAttribute('href', resultObj.url);
        linkButtonEl.classList.add('btn', 'btn-dark');
    
        resultBody.append(titleEl, bodyContentEl, linkButtonEl);
    } else {
        resultBody.append(titleEl, bodyContentEl)
    }
    
    resultContentEl.append(resultCard);
  }

function initMap() {

    // This function generates the map upon load

    let Houston_lat = 29.7604;
    let Houston_lon = -95.3698;

    var options = {
        zoom: 10,
        center: {lat:Houston_lat, lng:Houston_lon}
    }

}

function selectMap(coords) {

    // This function locates the area selected

    // coords: str, location found in the URL

   
    let userLocation = coords.split('&');

    let lat_coords = userLocation[1].split('=')[1];
    let lon_coords = userLocation[0].split('=')[1];

    let options = {
        zoom: 11,
        center: {lat:parseFloat(lat_coords), lng:parseFloat(lon_coords)}
    }

    let map = new google.maps.Map(document.getElementById('map'), options);
}


function getData(userLocation, userSelected) {

    // This function makes API requests based on the location and selected categories

    // userLocation: str, location based on the URL
    // userSelected: str, selected (checked) categories

    openTrip = 'https://api.opentripmap.com/0.1/en/places/radius?radius=32186&' + userLocation + '&kinds=' + userSelected + '&rate=1&limit=50&apikey=' + apiKey;

    fetch(openTrip)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            
            resultContentEl.textContent = '';

            userLocation = userLocation.split('&'); 

            let lat_coords = userLocation[1].split('=')[1];
            let lon_coords = userLocation[0].split('=')[1];
        
            let options = {
                zoom: 11,
                center: {lat:parseFloat(lat_coords), lng:parseFloat(lon_coords)}
            }
        
            var map = new google.maps.Map(document.getElementById('map'), options);  

            for (var i = 0; i < 5; i++) {

                var randomIndex = Math.floor(Math.random() * data.features.length);
                var xid = data.features[randomIndex].properties.xid;

                // open trip api for detailed info
                var xidUrl = 'https://api.opentripmap.com/0.1/en/places/xid/' + xid + '?apikey=' + apiKey;
                fetch(xidUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (xid) {
                        printResults(xid);
                        addMarkers(xid, map);
                    });
            };

        });
};


submitBtnEl.addEventListener('click', handleSearchFormSubmit);

getParams();

window.onload = function () {
    initMap();
};
