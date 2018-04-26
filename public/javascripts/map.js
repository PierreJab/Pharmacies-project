const mapDiv = document.querySelector(".my-map");


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
          <input type="hidden" name="name" value="${onePlace.name}" />
          <input type="hidden" name="place_id" value="${onePlace.place_id}" />
          <input type="hidden" name="formattedAddress" value="${onePlace.formatted_address}" />
          <input type="hidden" name="price_level" value="${onePlace.price_level}" />
          <input type="hidden" name="type0" value="${onePlace.types[0]}" />
          <input type="hidden" name="type1" value="${onePlace.types[1]}" />
          <input type="hidden" name="type2" value="${onePlace.types[2]}" />
          <input type="hidden" name="type3" value="${onePlace.types[3]}" />
          <input type="hidden" name="type4" value="${onePlace.types[4]}" />
          <input type="hidden" name="icon" value="${onePlace.icon}" />
          <input type="hidden" name="opennn" value="${opennn}" />
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

      var information = `<li class="oneItem">
        <p class="name">${onePlace.name}</p>
        <p class="address">${onePlace.formatted_address}</p>
        <p class="open">${opennn}</p>
        <hr>
        </li>
      `;
      $(".list").append(information);

      });


    };
  };

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

  
   
