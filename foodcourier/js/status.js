document.addEventListener("DOMContentLoaded", function() {
    loginstate();

    document.getElementById("logout").addEventListener("click", logout);
})

let loginStatus = false;

async function loginstate(){
    let navbarStatus = document.getElementById("navbar-status");
    loginStatus = await checkstatus();

    if(loginStatus == false){
        window.location.assign("index.html");

        navbarStatus.href = "status.html";
    } else {
        navbarStatus.href = "index.html";
    }
}

function logout() {
    let formData = new FormData();
    formData.append("f", "logout");
    let logoutError = document.getElementById("logouterror");

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
          window.location.assign("index.html");
        } else if (request == 2) {
          logoutError.innerHTML = "";
          logoutError.innerHTML =
            "Sikertelen kijelentkezés, próbáld újra, miután kiszállítottad az aktuális címet.";
        } else {
          logoutError.innerHTML = "Sikertelen kijelentkezés, próbáld újra.";
        }
      })
      .catch((response) => {
        logoutError.innerHTML = "";
        logoutError.innerHTML += "Sikertelen kijelentkezés, próbáld újra.<br>Hibakód: " + response.status + " " + response.statusText;
      });    
}