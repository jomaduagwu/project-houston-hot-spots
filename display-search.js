
const submitBtnEl = document.querySelector("#submit-btn");
const dropDown = document.getElementById("drop-down");
const checkBox = document.querySelectorAll('input');
const resultTextElement = document.getElementById("result-text");
const resultContentEl = document.querySelector('#result-content');

const locations = {
    Houston: { lat: 29.7604, lon: -95.3698},
    central: { lat: 29.7662, lon: -95.3632 },
    north: { lat: 30.0084, lon: -95.4268 },
    west: { lat: 29.8339, lon: -95.5625 },
    south: { lat: 29.5961, lon: -95.3853 },
    east: { lat: 29.7112, lon: -95.1500 },
    galveston: { lat: 29.3222, lon: -94.9226 }
  };

const checkboxes = [
    { name: 'food', label: 'Food' },
    { name: 'bars', label: 'Bars' },
    { name: 'events', label: 'Events' },
    { name: 'parks', label: 'Parks' },
    { name: 'sports', label: 'Sports' },
    { name: 'shopping', label: 'Shopping' },
    { name: 'accomodations', label: 'Hotels' },
    { name: 'attractions', label: 'Attractions' },
    { name: 'things-to-do', label: 'Things to do' }
  ];

let map;

apiKey = '5ae2e3f221c38a28845f05b6fc7cd900dbdfe52e778e3a8d9a518c53'

function handleSearchFormSubmit(event) {

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

    var searchParamsArr = document.location.search;
    var userLocation = searchParamsArr.split('location=')[1];
    userLocation = userLocation.substring(0, 24);
    var userSelected = searchParamsArr.split('selected=')[1];

    getData(userLocation, userSelected);
}

function addMarkers(resultObj, map) {

    var marker = new google.maps.Marker({
        position:{lat:resultObj.point.lat, lng:resultObj.point.lon},
        map: map
    })

    var infoWindow = new google.maps.InfoWindow({
        content: '<h1>' + resultObj.name + '</h1>'
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    } )
}

function printResults(resultObj) {

    console.log(resultObj);
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

    let Houston_lat = 29.7604;
    let Houston_lon = -95.3698;

    var options = {
        zoom: 10,
        center: {lat:Houston_lat, lng:Houston_lon}
    }

}

function selectMap(coords) {

    console.log(coords);
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
                zoom: 12,
                center: {lat:parseFloat(lat_coords), lng:parseFloat(lon_coords)}
            }
        
            var map = new google.maps.Map(document.getElementById('map'), options);

            for (var i = 0; i < 5; i++) {
                // This loops through the first five above and attaches to the next fetch
                // var featureName = data.features[i].properties.name;
                var xid = data.features[i].properties.xid;

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
