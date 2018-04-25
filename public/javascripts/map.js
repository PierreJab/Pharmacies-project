const mapDiv = document.querySelector(".my-map");

// function initialize() {

  const map =
  new google.maps.Map(mapDiv, {
    zoom: 12.5,
    center: {
      lat: 48.866667,
      lng: 2.333333
    }
  });


  // GEOLOCALISATION
  navigator.geolocation.getCurrentPosition((result) => {
    const { latitude, longitude } = result.coords;
  
    map.setCenter({ lat: latitude, lng: longitude });
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: "Your Location",
      animation: google.maps.Animation.DROP
    });
  });


    const locationInput = document.querySelector(".location-input");
    const latInput = document.querySelector(".lat-input");
    const lngInput = document.querySelector(".lng-input");


    const autocomplete = new google.maps.places.Autocomplete(locationInput);
    
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const loc = place.geometry.location;
      console.log(loc)
      latInput.value = loc.lat();
      lngInput.value = loc.lng();
      console.log(latInput.value);
      console.log(lngInput.value);
    });


  document.querySelector("#button").onclick = function (){

    var lati = Number(latInput.value);
    var long = Number(lngInput.value);
    new google.maps.Marker({
        position: {
          lat: lati,
          lng: long
        },
        map: map,
        title: locationInput.value,
        animation: google.maps.Animation.DROP
      })

    
    // Search for Pharmacy around the selected point in Paris.
    var request = {
      // location: map.getCenter(),
      location: {lat: lati, lng: long},
      radius: '500',
      query: 'pharmacy'
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

  // Checks that the PlacesServiceStatus is OK, and adds a marker
  // using the place ID and location from the PlacesService.
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        place: {
          placeId: results[0].place_id,
          location: results[0].geometry.location
        }
      });
      const id = marker.place.placeId;
      console.log(id);
    }
  }


    var request = {
    placeId: id
  };

  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, callback);

  function callback(place, status) {
    console.log('place: ', place[0])
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      place.forEach((onePlace) => {
        const latitude = onePlace.geometry.viewport.f.f;
        const longitude = onePlace.geometry.viewport.b.b;

        const content = `<div id="content"> 
        ${onePlace.formatted_address}
        </div>`;

        var infowindow = new google.maps.InfoWindow({
          content: content
        });


        const marker = new google.maps.Marker({
            position: {
              lat: latitude,
              lng: longitude
            },
            map: map,
            title: "Paris, France",
            animation: google.maps.Animation.DROP
          });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

      });
    };
  }


  };

  
   
  

  // const Pharmacies = new google.maps.places.Autocomplete(locationInput, options)




// Calling the function
// google.maps.event.addDomListener(window, 'load', initialize);

// ---------- Adding a marker ! ----------//
// new google.maps.Marker({
//   position: {
//     lat: 48.866667,
//     lng: 2.333333
//   },
//   map: map,
//   title: "Paris, France",
//   animation: google.maps.Animation.DROP
// });




// DATA FROM BACKEND
// // retrieve restaurant data from our backend
// axios.get("/resto/data")
//   .then((response) => {
//     const restoList = response.data;

//     restoList.forEach((oneResto) => {
//       const [ lat, lng ] = oneResto.location.coordinates;
//       new google.maps.Marker({
//         position: { lat, lng },
//         map: map,
//         title: oneResto.name,
//         animation: google.maps.Animation.DROP
//       });
//     });
//   })
//   .catch((err) => {
//     alert("Something went wrong! 💩");
//   });



/* ------------------------------------------------- */


/* 
function initialize() {
  var pyrmont = new google.maps.LatLng(48.866667, 2.333333); // Paris

  var map = new google.maps.Map(document.querySelector(".my-map"), {
    center: pyrmont,
    zoom: 12,
    // scrollwheel: false
  });

  // Specify location, radius and place types for your Places API search.
  var request = {
    location: pyrmont,
    radius: '7500',
    types: ['pharmacy']
  };

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(map);
  // var short = google.maps.places.RankBy.DISTANCE(map);
  // console.log(short);
  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          animation: google.maps.Animation.DROP
        });
      }
    }
  });

  service.getDetails(request, (details) => {
    console.log(details);
  });











  navigator.geolocation.getCurrentPosition((result) => {
    const { latitude, longitude } = result.coords;
  
    map.setCenter({ lat: latitude, lng: longitude });
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: "Your Location",
      animation: google.maps.Animation.DROP
    });
  });
  
  // retrieve restaurant data from our backend
  axios.get("/resto/data")
    .then((response) => {
      const restoList = response.data;
  
      restoList.forEach((oneResto) => {
        const [ lat, lng ] = oneResto.location.coordinates;
        new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: oneResto.name,
          animation: google.maps.Animation.DROP
        });
      });
    })
    .catch((err) => {
      alert("Something went wrong! 💩");
    });
  
  
  const locationInput = document.querySelector(".location-input");
  const latInput = document.querySelector(".lat-input");
  const lngInput = document.querySelector(".lng-input");
  
  const autocomplete = new google.maps.places.Autocomplete(locationInput);
  
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const loc = place.geometry.location;
  
    latInput.value = loc.lat();
    lngInput.value = loc.lng();
  });
  


}

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);




 */






/* var map;

function initialize() {
  // Create a map centered in Pyrmont, Sydney (Australia).
  map = new google.maps.Map(document.querySelector(".second-map"), {
    center: {lat: 48.866667, lng: 2.33},
    zoom: 15
  });

  // Search for McDonald's in Paris.
  var request = {
    location: map.getCenter(),
    radius: '500',
    query: 'kfc'
  };

  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

// Checks that the PlacesServiceStatus is OK, and adds a marker
// using the place ID and location from the PlacesService.
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var marker = new google.maps.Marker({
      map: map,
      place: {
        placeId: results[0].place_id,
        location: results[0].geometry.location
      }
    });
    const id = marker.place.placeId;
    console.log(id)
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
 */








/* ----------- GET DETAILS ---------- */
// var request = {
//   // placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
//   placeId: 'ChIJhUfAoBFu5kcRELNq_CDpgMg'
// };

// service = new google.maps.places.PlacesService(map);
// service.getDetails(request, callback);

// function callback(place, status) {
//   console.log('place: ', place)
//   if (status == google.maps.places.PlacesServiceStatus.OK) {
//     createMarker(place);
//   }
// }

