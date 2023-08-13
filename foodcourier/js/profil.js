document.addEventListener("DOMContentLoaded", function() {
    loginstate();

    document.getElementById("pw").addEventListener("input", validatePw);
    document.getElementById("pw2").addEventListener("input", validatePwAgain);
})

async function loginstate(){
    let availability = document.getElementById("availability");
    let availabilityText = document.getElementById("availability-text");
    let availabilityIcon = document.createElement("img");
    let navbarStatus = document.getElementById("navbar-status");
    let content = document.querySelector(".content");
  
    if(await checkstatus() == true){
        availabilityText.innerHTML = "Elérhető";
        availabilityIcon.src = "imgs/icon_online.png";
        availabilityIcon.alt = "OnlineIcon";
        availability.appendChild(availabilityIcon);
  
        navbarStatus.href = "status.html";

        getProfileData(content);
    } else {
        availabilityText.innerHTML = "Offline";
        availabilityIcon.src = "imgs/icon_offline.png";
        availabilityIcon.alt = "OfflineIcon";
        availability.appendChild(availabilityIcon);
  
        navbarStatus.href = "index.html";

        let loginRequired = document.createElement("p");
        loginRequired.innerHTML = "Jelentkezz be, ahhoz, hogy meg tudd nézni a profil adataidat!";
        loginRequired.classList.add("text-danger");
        content.appendChild(loginRequired);
    }
}

function getProfileData(hova) {
    let formData = new FormData();
    formData.append("f", "profileData");

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
          for (const key in data) {
            let card = document.createElement("div");
            card.classList.add("card");
  
            let cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header", "fw-bold");

            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            cardHeader.innerHTML = key;
            
            if (key == "Online státusz") {
                if (data[key] == 1) {
                    cardBody.innerHTML = "Online";
                }
            } else if (key == "Van-e címe") {
                if (data[key] == 1) {
                    cardBody.innerHTML = "Igen";
                } else {
                    cardBody.innerHTML = "Nincs";
                }
            } else {
                cardBody.innerHTML = data[key];
            }

            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            hova.appendChild(card);
          }

          let cardPwMod = document.createElement("div");
          cardPwMod.classList.add("card", "mb-3");
          cardPwMod.id = "cardpwmod";

          let cardHeaderPwMod = document.createElement("div");
          cardHeaderPwMod.classList.add("card-header", "fw-bold");

          let cardBodyPwMod = document.createElement("div");
          cardBodyPwMod.classList.add("card-body");

          cardHeaderPwMod.innerHTML = "Jelszó módosítás";

          let formFloatingDivPw = document.createElement("div");
          formFloatingDivPw.classList.add("form-group", "form-floating" , "mb-3", "mt-2");

          let formPwMod = document.createElement("form");
          formPwMod.setAttribute("id", "pwmod");
          formPwMod.classList.add("need-validation");
          formPwMod.id = "pwmod";
          formPwMod.noValidate = true;

          let PwInput = document.createElement("input");
          PwInput.type = "password";
          PwInput.id = "pw";
          PwInput.name = "pw";
          PwInput.classList.add("form-control", "form-control-lg");
          PwInput.placeholder = " ";
          PwInput.required = true;

          let PwInputLabel = document.createElement("label");
          PwInputLabel.classList.add("form-label");
          PwInputLabel.for = "pw";
          PwInputLabel.innerHTML = "Jelszó";

          let formFloatingDivPw2 = document.createElement("div");
          formFloatingDivPw2.classList.add("form-group", "form-floating", "mb-3");

          let PwInput2 = document.createElement("input");
          PwInput2.type = "password";
          PwInput2.id = "pw2";
          PwInput2.name = "pw2";
          PwInput2.classList.add("form-control", "form-control-lg");
          PwInput2.placeholder = " ";
          PwInput2.required = true;

          let PwInputLabel2 = document.createElement("label");
          PwInputLabel2.classList.add("form-label");
          PwInputLabel2.for = "pw2";
          PwInputLabel2.innerHTML = "Jelszó újra";

          let PwModButton = document.createElement("button");
          PwModButton.type = "button";
          PwModButton.classList.add("btn", "btn-danger", "btn-lg", "btn-block", "w-100");
          PwModButton.id = "pwmodbutton";
          PwModButton.innerHTML = "Jelszó módosítás";

          formFloatingDivPw.appendChild(PwInput);
          formFloatingDivPw.appendChild(PwInputLabel);

          formFloatingDivPw2.appendChild(PwInput2);
          formFloatingDivPw2.appendChild(PwInputLabel2);

          formPwMod.appendChild(formFloatingDivPw);
          formPwMod.appendChild(formFloatingDivPw2);

          cardBodyPwMod.appendChild(formPwMod);
          cardBodyPwMod.appendChild(PwModButton);
          
          cardPwMod.appendChild(cardHeaderPwMod);
          cardPwMod.appendChild(cardBodyPwMod);

          hova.appendChild(cardPwMod);

          PwModButton.addEventListener("click", PwModification);
       }
    })
    .catch((error) => {
        alert("Sikertelen adatlekérés.\nHibakód: " + error.status + " " + error.statusText)
    });
}

function pwReg(pw) {
    let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/]{8,32}$/;
  
    return pattern.test(pw);
  }
  
  function validatePw() {
    if (pwReg(document.getElementById("pw").value)) {
      document.getElementById("pw").classList.remove("is-invalid");
      document.getElementById("pw").classList.add("is-valid");
      return true;
    } else {
      document.getElementById("pw").classList.remove("is-valid");
      document.getElementById("pw").classList.add("is-invalid");
      return false;
    }
  }
  
  function validatePwAgain() {
    if (pwReg(document.getElementById("pw2").value)) {
      document.getElementById("pw2").classList.remove("is-invalid");
      document.getElementById("pw2").classList.add("is-valid");
      return true;
    } else {
      document.getElementById("pw2").classList.remove("is-valid");
      document.getElementById("pw2").classList.add("is-invalid");
      return false;
    }
  }

function PwModification() {
    let formData = new FormData(document.getElementById("pwmod"));
    formData.append("f", "pwMod");
    let pw = document.getElementById("pw");
    let pwAgain = document.getElementById("pw2");

    if(validatePw() && validatePwAgain()) {
      if (pw.value == pwAgain.value) {
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
            if (request == 1) {
              alert("Sikeres jelszmódosítás!");
              window.location.assign("profil.html");
            } else if (request == 0) {
             alert("Sikertelen jelszó módosítás, próbáld újra!");
            }
          })
          .catch((response) => {
            alert("Sikertelen jelszó módosítás, próbáld újra!\nHibakód: " + response.status + response.statusText);
          });
        } else {
            alert("A jelszavak nem egyeznek!");
        }   
    } else {
        alert("Minden mező kitöltése kötelező!");
    }
}