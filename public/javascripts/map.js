const mapDiv = document.querySelector(".my-map");

// function initialize() {

  const map =
  new google.maps.Map(mapDiv, {
    // scrollwheel: false
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
      latInput.value = loc.lat();
      lngInput.value = loc.lng();
    });


  document.querySelector(".search button").onclick = function (){

    var lati = Number(latInput.value);
    var long = Number(lngInput.value);

    map.setCenter({ lat: lati, lng: long});
 
    new google.maps.Marker({
        position: {
          lat: lati,
          lng: long
        },
        map: map,
        title: locationInput.value,
        animation: google.maps.Animation.DROP,
        animation: google.maps.Animation.BOUNCE,
      })

    
      

    // Search for Pharmacy around the selected point in Paris.
    var request = {
      // location: map.getCenter(),
      location: {lat: lati, lng: long},
      radius: '1500',
      query: 'pharmacy'
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    // id = callbackback(results, status);

  //   var request = {
  //   placeId: id
  // };

  service = new google.maps.places.PlacesService(map);
  service.getDetails({placeId: id}, callback);

  function callback(place, status) {
    console.log('place: ', place)
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      place.forEach((onePlace) => {
        console.log(onePlace);
        const latitude = onePlace.geometry.viewport.f.f;
        const longitude = onePlace.geometry.viewport.b.b;

        if (onePlace.opening_hours.open_now){
          var opennn = "Open Now";
          var color = "green"
        } else {
          var opennn = "Closed";
          var color = "red"
        }

        const content = `<div id="content"> 
        <img src="" alt="">
        <h5 style="text-align: center">${onePlace.name}</h5>
        ${onePlace.formatted_address} <br/>
          <div style="display: flex; justify-content: space-evenly; margin: 2vh 0 0 0">
            <img src="${onePlace.icon }" style="width: 3vw; height: 5vh" alt="">
            <p style="color: ${color};  font-weight: bold; padding: 2vh 0">${opennn}</p>
          </div>
          
          <form action="/pharmacy/process-one-pharmacy" method="POST"">
          <input type="hidden" name="onePlace" value="${onePlace}" />
          <p style="text-align: center"><button style="color: black"> More information</button></p>
          </form>
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

        // marker.addListener('mouseover', function() {
        //   infowindow.open(map, marker);
        // });

        // marker.addListener('mouseout', function() {
        //   infowindow.close(map, marker);
        // });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

      var information = `<li>
        <h2>${onePlace.name}
        <p>${onePlace.formatted_address}</p>
        <p>${opennn}</p>
        </li>
      `;
      document.querySelector(".list").append(information);
      // $( "#maps .list" ).append(content);

      });


    };
  }


  };


   // Checks that the PlacesServiceStatus is OK, and adds a marker
  // using the place ID and location from the PlacesService.
  function callbackback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        place: {
          placeId: results[0].place_id,
          location: results[0].geometry.location
        }
      });
      const id = marker.place.placeId;
    }
    return results[0].place_id
  }

  
   




/* ------------------------------------------------- */


/*

  
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



/* 


var map;

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

