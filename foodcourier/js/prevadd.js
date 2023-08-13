document.addEventListener("DOMContentLoaded", function() {
    loginstate();
})

async function loginstate(){
  let availability = document.getElementById("availability");
  let availabilityText = document.getElementById("availability-text");
  let availabilityIcon = document.createElement("img");
  let navbarStatus = document.getElementById("navbar-status");

  if(await checkstatus() == true){
      getprevadds();

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

      let recentadds = document.getElementById("recentadds");
      let history = recentadds.children[0];
      let statusmessage = document.createElement("p");
      
      recentadds.innerHTML = "";

      statusmessage.innerHTML = "Jelentkezz be, hogy meg tudd nézni a kiszállított címeidet!";

      statusmessage.classList.add("text-danger");

      recentadds.appendChild(history);
      recentadds.appendChild(statusmessage);

      navbarStatus.href = "index.html";
  }
}

function getprevadds() {
   let formData = new FormData();
   formData.append("f", "getprevadds");

   let alert = document.getElementById("loginerror");

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
       let adds = JSON.parse(request);

       if (adds.length == 0) {
          let recentadds = document.getElementById("recentadds");
          let history = recentadds.children[0];
          let statusmessage = document.createElement("p");
          
          recentadds.innerHTML = "";
      
          statusmessage.innerHTML = "A mai napon még nem volt egy teljesített kiszállításod sem. <br>Teljesíts egy címet, hogy az megjelenjen a statisztikádban!";
      
          statusmessage.classList.add("text-danger");
      
          recentadds.appendChild(history);
          recentadds.appendChild(statusmessage);
       } else {
          let list = document.getElementById("list");

          for (let i = 0; i < adds.length; i++){
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerHTML = adds[i].etteremnev + " - " + adds[i].vevocim + " <br>Teljesítve: " + adds[i].rendelesteljesitve;
            list.appendChild(li);
        }
       }
    })
    .catch((error) => {
       alert.classList.remove("d-none");
       alert.children[0].innerHTML +=
         " Hibakód: " + error.status + " " + error.statusText;
    });
}