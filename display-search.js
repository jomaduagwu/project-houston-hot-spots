var queryString = document.location.search;
var userLocation = queryString.split('location=')[1];
userLocation = userLocation.substring(0, 24);
var userSelected = queryString.split('selected=')[1];
console.log(userLocation);
console.log(userSelected);
var central = "lon=-95.3632&lat=29.7662";
var north = "lon=-95.4268&lat=30.0084";
var west = "lon=-95.5625&lat=29.8339";
var south = "lon=-95.3853&lat=29.5961";
var east = "lon=-95.1500&lat=29.7112";
var galvston = "lon=-94.9226&lat=29.3222";


apiKey = '5ae2e3f221c38a28845f05b6fc7cd900dbdfe52e778e3a8d9a518c53'
// open trip
apiUrl = 'http://api.opentripmap.com/0.1/ru/places/bbox?lon_min=-95.358421&lat_min=29.749907&lon_max=-95.372809&lat_max=29.859052&kinds=churches&format=geojson&apikey='
openTrip = 'https://api.opentripmap.com/0.1/en/places/radius?radius=32186&' + userLocation + '&kinds=' + userSelected + '&rate=1&limit=50&apikey=' + apiKey;

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
            getData();