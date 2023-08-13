document.addEventListener("DOMContentLoaded", function() {
    loginstate();
    cimAdat();
})

async function loginstate(){
    let availability = document.getElementById("availability");
    let availabilityText = document.getElementById("availability-text");
    let availabilityIcon = document.createElement("img");
    let navbarStatus = document.getElementById("navbar-status");

    if(await checkstatus() == true){
        availabilityText.innerHTML = "Elérhető";
        availabilityIcon.src = "imgs/icon_online.png";
        availabilityIcon.alt = "OnlineIcon";
        availability.appendChild(availabilityIcon);

        navbarStatus.href = "status.html";
    } else {
        let curAdd = document.getElementById("current-address");
        curAdd.children[1].innerHTML = "Jelentkezz be, hogy meg tudd kezdeni a kiszállítást!";
        curAdd.children[1].classList.add("text-danger");

        availabilityText.innerHTML = "Offline";
        availabilityIcon.src = "imgs/icon_offline.png";
        availabilityIcon.alt = "OfflineIcon";
        availability.appendChild(availabilityIcon);

        navbarStatus.href = "index.html";
    }
}

function cimAdat() {
    let formData = new FormData();
    formData.append("f", "cimadat");
    let addressDetails = document.getElementById("current-address");
    addressDetails.innerHTML = "";

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
      let cimAdat = JSON.parse(request);
    
      if (cimAdat != 0) {
        switch (cimAdat.allapot) {
          case "-1":
            noCurrentAddress(addressDetails);
            break;
          case "0":
            etterem(cimAdat, addressDetails);
            break;
          case "1":
            megrendelo(cimAdat, addressDetails);
            break;
        }
      } else {
        noCurrentAddress(addressDetails);
      }
    })
    .catch((response) => {
      alert("Sikertelen címadat kérés, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });    
}

function noCurrentAddress(addressDetails) {
    let noAddress = document.createElement("h1");
    noAddress.innerHTML = "Jelenleg nincsen kiszállítandó címed";

    let goBackToMap = document.createElement("p");
    goBackToMap.innerHTML = "Térj vissza a ";

    let mapLink = document.createElement("a");
    mapLink.classList.add("link");
    mapLink.href = "map.html";
    mapLink.innerText = "térképre";

    goBackToMap.appendChild(mapLink);
    goBackToMap.innerHTML += ", hogy el tudd fogadni a beérkező címeket!";


    addressDetails.appendChild(noAddress);
    addressDetails.appendChild(goBackToMap);
}

function etterem(cimAdat, addressDetails) {
    let goToRest = document.createElement("h1");
    goToRest.innerHTML = "Menj az étteremhez";

    let etteremAdat = document.createElement("div");
    etteremAdat.classList.add("card");

    let etteremAdatHeader = document.createElement("div");
    etteremAdatHeader.classList.add("card-header");
    let etteremNev = document.createElement("h5");
    etteremNev.innerHTML = cimAdat.etteremId;
    etteremAdatHeader.appendChild(etteremNev);

    let etteremBody = document.createElement("div");
    etteremBody.classList.add("card-body");
    let etteremCim = document.createElement("p");
    etteremCim.innerHTML = cimAdat.etteremcim;
    let navigation = document.createElement("a");
    navigation.href = `https://maps.google.com/?q=${cimAdat.etteremcim}`;
    navigation.id = "navigation-link";
    navigation.innerHTML = "Útvonalterv az étteremhez: ";
    let navigationIcon = document.createElement("img");
    navigationIcon.src = "imgs/googlemapsicon.jpg";
    navigationIcon.alt = "Google Maps";
    navigationIcon.id = "navigationicon";
    navigation.appendChild(navigationIcon);
    etteremBody.appendChild(etteremCim);
    etteremBody.appendChild(navigation);

    etteremAdat.appendChild(etteremAdatHeader);
    etteremAdat.appendChild(etteremBody);

    let rendelesAdat = document.createElement("div");
    rendelesAdat.classList.add("card");

    let rendelesHeader = document.createElement("div");
    rendelesHeader.classList.add("card-header");
    let rendelesHeaderCim = document.createElement("h5");
    rendelesHeaderCim.innerHTML = "Rendeles adatai";
    rendelesHeader.appendChild(rendelesHeaderCim);

    let rendelesBody = document.createElement("div");
    rendelesBody.classList.add("card-body");
    let sorszam = document.createElement("p");
    let strong = document.createElement("strong");
    strong.innerHTML = "Rendelés sorszáma: ";
    sorszam.appendChild(strong);
    sorszam.innerHTML += `#${cimAdat.sorszam}`;
    let megrendeloNev = document.createElement("p");
    strong.innerHTML = "Megrendelő neve: ";
    megrendeloNev.appendChild(strong);
    megrendeloNev.innerHTML += cimAdat.megrendelonev;
    let tetelek = document.createElement("ul");
    tetelek.classList.add("list-group");
    let tetelekHeader = document.createElement("li");
    tetelekHeader.classList.add("list-group-item", "list-group-item-dark", "fw-bold");
    tetelekHeader.innerHTML = "Tételek:";
    tetelek.appendChild(tetelekHeader);

    tetelekFelsorolas(tetelek);

    rendelesBody.appendChild(sorszam);
    rendelesBody.appendChild(megrendeloNev);
    rendelesBody.appendChild(tetelek);

    rendelesAdat.appendChild(rendelesHeader);
    rendelesAdat.appendChild(rendelesBody);

    let cimFelvetelInfo = document.createElement("p");
    cimFelvetelInfo.classList.add("text-danger", "mt-2");
    cimFelvetelInfo.innerHTML =
      "Miután minden tételt megkaptál, kezdd meg a kiszállítást a rendelés felvétele gomb megynomása után!";

    let rendelesFelvetel = document.createElement("button");
    rendelesFelvetel.type = "button";
    rendelesFelvetel.classList.add("btn", "btn-danger");
    rendelesFelvetel.id = "pickup";
    strong.innerHTML = "Rendelés felvétele";
    rendelesFelvetel.appendChild(strong);

    addressDetails.appendChild(goToRest);
    addressDetails.appendChild(etteremAdat);
    addressDetails.appendChild(rendelesAdat);
    addressDetails.appendChild(cimFelvetelInfo);
    addressDetails.appendChild(rendelesFelvetel);

    rendelesFelvetel.addEventListener("click", pickUpOrder);
}

function megrendelo(cimAdat, addressDetails) {
    let startDelivery = document.createElement("h1");
    startDelivery.innerHTML = "Kezzd meg a kiszállítást";


    let megrendeloAdat = document.createElement("div");
    megrendeloAdat.classList.add("card");


    let megrendeloAdatHeader = document.createElement("div");
    megrendeloAdatHeader.classList.add("card-header");
    let megrendeloHeaderFelirat = document.createElement("h5");
    megrendeloHeaderFelirat.innerHTML = "Megrendelő adatai";
    megrendeloAdatHeader.appendChild(megrendeloHeaderFelirat);


    let megrendeloBody = document.createElement("div");
    megrendeloBody.classList.add("card-body");

    let strong = document.createElement("strong");
    let megrendeloNev = document.createElement("p");
    strong.innerHTML = "Név: ";
    megrendeloNev.appendChild(strong);
    megrendeloNev.innerHTML += cimAdat.megrendelonev;
    megrendeloBody.appendChild(megrendeloNev);

    let megrendeloTel = document.createElement("p");
    megrendeloTel.classList.add("fw-bold");
    strong.innerHTML = "Telelfonszám: ";
    megrendeloTel.innerHTML += strong.innerHTML;
    let callable = document.createElement("a");
    callable.classList.add("fw-normal");
    callable.innerHTML += cimAdat.rendelotelszam;
    callable.href = "tel:" + cimAdat.rendelotelszam;
    megrendeloTel.appendChild(callable);
    megrendeloBody.appendChild(megrendeloTel);

    let szallitasAdatok = document.createElement("ul");
    szallitasAdatok.classList.add("list-group", "mb-2");

    let szallitasAdatokHeader = document.createElement("li");
    szallitasAdatokHeader.classList.add("list-group-item", "list-group-item-dark", "fw-bold");
    szallitasAdatokHeader.innerHTML = "Szállítási adatok";
    szallitasAdatok.appendChild(szallitasAdatokHeader);
    

    let cim = document.createElement("li");
    cim.classList.add("list-group-item");
    strong.innerHTML = "Cím: ";
    cim.appendChild(strong);
    cim.innerHTML += `${cimAdat.varos} ${cimAdat.irsz}, ${cimAdat.utca} ${cimAdat.hsz}`;
    szallitasAdatok.appendChild(cim);

    if (cimAdat.csengo != null) {
      let csengo = document.createElement("li");
      csengo.classList.add("list-group-item");
      strong.innerHTML = "Kapucsengő: ";
      csengo.appendChild(strong);
      csengo.innerHTML += cimAdat.csengo;
      szallitasAdatok.appendChild(csengo);
    }

    if (cimAdat.emelet != null) {
      let emelet = document.createElement("li");
      emelet.classList.add("list-group-item");
      strong.innerHTML = "Emelet: ";
      emelet.appendChild(strong);
      emelet.innerHTML += cimAdat.emelet;
      szallitasAdatok.appendChild(emelet);
    }

    if (cimAdat.ajto != null) {
      let ajto = document.createElement("li");
      ajto.classList.add("list-group-item");
      strong.innerHTML = "Ajtó: ";
      ajto.appendChild(strong);
      ajto.innerHTML += cimAdat.ajto;
      szallitasAdatok.appendChild(ajto);
    }

    megrendeloBody.appendChild(szallitasAdatok);

    let navigation = document.createElement("a");
    navigation.href = `https://maps.google.com/?q=${cimAdat.varos} ${cimAdat.irsz}, ${cimAdat.utca} ${cimAdat.hsz}`;
    navigation.id = "navigation-link";
    navigation.innerHTML = "Útvonalterv az megrendelőhöz: ";
    let navigationIcon = document.createElement("img");
    navigationIcon.src = "imgs/googlemapsicon.jpg";
    navigationIcon.alt = "Google Maps";
    navigationIcon.id = "navigationicon";
    navigation.appendChild(navigationIcon);
    megrendeloBody.appendChild(navigation);

    megrendeloAdat.appendChild(megrendeloAdatHeader);
    megrendeloAdat.appendChild(megrendeloBody);


    let rendelesAdat = document.createElement("div");
    rendelesAdat.classList.add("card");

    let rendelesHeader = document.createElement("div");
    rendelesHeader.classList.add("card-header");
    let rendelesHeaderCim = document.createElement("h5");
    rendelesHeaderCim.innerHTML = "Rendelés adatai";
    rendelesHeader.appendChild(rendelesHeaderCim);
    rendelesAdat.appendChild(rendelesHeader);

    let rendelesBody = document.createElement("div");
    rendelesBody.classList.add("card-body");
    let sorszam = document.createElement("p");
    strong.innerHTML = "Rendelés sorszáma: ";
    sorszam.appendChild(strong);
    sorszam.innerHTML += `#${cimAdat.sorszam}`;
    rendelesBody.appendChild(sorszam);

    let tetelek = document.createElement("ul");
    tetelek.classList.add("list-group");
    let tetelekHeader = document.createElement("li");
    tetelekHeader.classList.add("list-group-item", "list-group-item-dark", "fw-bold");
    tetelekHeader.innerHTML = "Tételek";
    tetelek.appendChild(tetelekHeader);

    tetelekFelsorolas(tetelek);

    rendelesBody.appendChild(sorszam);
    rendelesBody.appendChild(tetelek);

    rendelesAdat.appendChild(rendelesBody);


    let rendelesFelvetel = document.createElement("button");
    rendelesFelvetel.type = "button";
    rendelesFelvetel.classList.add("btn", "btn-danger", "mt-4");
    rendelesFelvetel.id = "done";
    strong.innerHTML = "Rendelés kiszállítva";
    rendelesFelvetel.appendChild(strong);

    addressDetails.appendChild(startDelivery);
    addressDetails.appendChild(startDelivery);
    addressDetails.appendChild(megrendeloAdat);
    addressDetails.appendChild(rendelesAdat);
    addressDetails.appendChild(rendelesFelvetel);

    rendelesFelvetel.addEventListener("click", deliveryDone);
}

function pickUpOrder() {
    let formData = new FormData();
    formData.append("f", "pickUpOrder");

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
      let orderPickUp = JSON.parse(request);
      
      if (orderPickUp != 0) {
        cimAdat();
      }
    })
    .catch((response) => {
      alert("Hiba a rendelés felvétel során, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });    
}

function deliveryDone() {
    let formData = new FormData();
    formData.append("f", "deliveryDone");

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
      let deliverydone = JSON.parse(request);
      
      if (deliverydone != 0) {
        cimAdat();
      }
    })
    .catch((response) => {
      alert("Hiba a rendelés felvétel során, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });    
}

function tetelekFelsorolas(tetelek) {
  let formData = new FormData();
    formData.append("f", "getTetelek");

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
      let data = JSON.parse(request);
      
      if (data != 0) {
          for(let i = 0; i < data.length; i++) {
              let li = document.createElement('li');
              li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

              let liDiv = document.createElement("div");
              liDiv.classList.add("ms-2", "me-auto");

              liDiv.innerHTML = data[i].tetelId;

              let span = document.createElement("span");
              span.classList.add("badge", "bg-primary", "rounded-pill");

              span.innerHTML = data[i].darab;

              li.appendChild(liDiv);
              li.appendChild(span);

              tetelek.appendChild(li);
          }
      }
    })
    .catch((response) => {
      alert("Hiba a rendelés tételeinek lekérdezése, próbáld újra.\nHibakód: " + response.status + " " + response.statusText);
    });    
}