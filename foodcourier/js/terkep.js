document.addEventListener("DOMContentLoaded", function(){
    loginstate();
    sendLocation();
    document.getElementById("confirmaddress").addEventListener("click", confirmAddress);
})

let loginstatus = false;

async function loginstate(){
  let availability = document.getElementById("availability");
  let availabilityText = document.getElementById("availability-text");
  let availabilityIcon = document.createElement("img");
  let navbarStatus = document.getElementById("navbar-status");
  loginstatus = await checkstatus();

  if(loginstatus == true){
      availabilityText.innerHTML = "Elérhető";
      availabilityIcon.src = "imgs/icon_online.png";
      availabilityIcon.alt = "OnlineIcon";
      availability.appendChild(availabilityIcon);

      navbarStatus.href = "status.html";
  } else {
      availabilityText.innerHTML = "Offline";
      availabilityIcon.src = "imgs/icon_offline.png";
      availabilityIcon.alt = "OfflineIcon";
      availability.appendChild(availabilityIcon);

      navbarStatus.href = "index.html";
  }
}

function initMapAddress() {
    let action = 0; 
    let erroralert = document.getElementById("loginerror");
    let cimAdat = document.getElementById("cimadat");
    let formData = new FormData();
    formData.append("f", "getAddress");

    let geocoder;
    var iconBase = 'https://maps.google.com/mapfiles/kml/pal2/';
    var markers = [];
    var bounds = new google.maps.LatLngBounds();

    window.map = new google.maps.Map(document.getElementById("map"), {
      mapId: "cfc56cdb553d0b51",
      disableDefaultUI: true,
      clickableIcons: false
    });

    function getlocation(vancim, login) {
      var successHandler = function (position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        var markerCurPos = new google.maps.Marker({
          position: pos,
          icon: iconBase + "icon39.png",
          map: map,
        });

        if (vancim) {
          bounds.extend(markerCurPos.position);
        }

        if (!login) {
          window.map.setCenter(markerCurPos.position);
          window.map.setZoom(14);
        }
        markers.push(markerCurPos);
      };

      var errorHandler = function (errorObj) {
        alert(errorObj.code + ": " + errorObj.message);
      };

      navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
        enableHighAccuracy: true,
        maximumAge: 10000,
      });
    }

    function drawMap() {
      if (loginstatus == true) {
        if (action < 2) {
          fetch("adat.php", {
            method: "POST",
            body: formData,
          })
           .then((response) => {
              if (response.ok) {
                return response.text();
              }
       
              return Promise.reject(response);
           })
           .then((request) => {
              let t = JSON.parse(request);

              if (t != 0) {
                if (action == 1 && t.allapot == -1) {
                  Notification.requestPermission()
                  .then(permission => {
                    if (permission === "granted") {
                      new Notification("Új kiszállítás");
                    }
                  })

                  cimAdat.children[1].innerHTML += `${t.etteremId}`;
                  cimAdat.children[2].innerHTML += `${t.varos} ${t.irsz}, ${t.utca} ${t.hsz}`;

                  cimAdat.style.display = 'block';
                }

                mapClear(markers);
    
                getlocation(true, loginstatus);
                
                var address = `${t.varos} ${t.utca} ${t.hsz}, HU`;
                geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': address }, function(results, status){
                  if (status == 'OK') {
                    var markerGuest = new google.maps.Marker({
                      position: results[0].geometry.location,
                      icon: iconBase + 'icon8.png',
                      map: map
                    });
                    
                    markers.push(markerGuest);
                    bounds.extend(markerGuest.position);
                  } else {
                    alert(`Geocode was not successful for the following reason: ${status}`);
                  }
                });
        
                let restPozLat = parseFloat(t.restpozlat);
                let restPozLng = parseFloat(t.restpozlng);
                let restPoz = { lat: restPozLat, lng: restPozLng };
                var markerRest = new google.maps.Marker({
                    position: restPoz,
                    icon: iconBase + 'icon32.png',
                    map: map
                });
                
                markers.push(markerRest);
                bounds.extend(markerRest.position);

                map.fitBounds(bounds);
                map.panToBounds(bounds);

                action++;
              } else {
                mapClear(markers);
    
                getlocation(true, false);
              }
           })
           .catch((error) => {
              erroralert.classList.add("show");
              erroralert.children[0].innerHTML = "";
              erroralert.children[0].innerHTML +=
                "Sikertelen adatlekérés. Hibakód: " + error.status + " " + error.statusText;
           });
        }
      } else {
        mapClear(markers);

        getlocation(false, loginstatus);
      }

       setTimeout(drawMap, 5000);
    }

    drawMap(); 
}

window.initMapAddress = initMapAddress;

function mapClear(markers) {
  for(let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  markers = [];
}


function sendLocation() {
  if (loginstatus) {
    var successHandler = function (position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
  
      let formData = new FormData();
      formData.append("f", "location");
      formData.append("d", JSON.stringify(pos));
  
      fetch("adat.php", {
        method: "POST",
        body: formData,
      })
      .then((response) => {
         if (!response.ok) {
           return Promise.reject(response);
         }
      })
      .catch((response) => {
         alert("Sikertelen adatküldés.\nHibakód: " + response.status + " " + response.statusText);
      });    
    };
  
    var errorHandler = function (errorObj) {
      alert(errorObj.code + ": " + errorObj.message);
    };
  
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      maximumAge: 10000,
    });
  
  }
  setTimeout(sendLocation, 5000);
}

function confirmAddress() {
  let formData = new FormData();
  formData.append("f", "confirmaddress");
  let cimadat = document.getElementById("cimadat");
  
  fetch("adat.php", {
    method: "POST",
    body: formData,
  })
  .then((response) => {
     if (response.ok) {
       return response.text();
     }

     return Promise.reject(response);
  })
  .then(request => {
    if (request == 1) {
      cimadat.style.display = "none";
    }
  })
  .catch((response) => {
     alert("Sikertelen adatküldés.\nHibakód: " + response.status + " " + response.statusText);
  });    
}