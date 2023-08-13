document.addEventListener("DOMContentLoaded", function(){
    loginstate();

    document.getElementById("email").addEventListener("input", validateEmail);
    document.getElementById("pw").addEventListener("input", validatePw);
    document.getElementById("loginbtn").addEventListener("click", login);
})

let loginStatus = false;

async function loginstate(){
    let navbarStatus = document.getElementById("navbar-status");
    loginStatus = await checkstatus();

    if(loginStatus){
        window.location.assign("status.html");

        navbarStatus.href = "status.html";
    } else {
        navbarStatus.href = "index.html";
    }
}

let correctEmail = false;
let correctPw = false;

function validateEmail() {
    let pattern = /^((?!\.)[\w_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm

    if (pattern.test(document.getElementById("email").value)) {
        correctEmail = true;
        document.getElementById("email").classList.remove("is-invalid");
        document.getElementById("email").classList.add("is-valid");
    } else {
        correctEmail = false;
        document.getElementById("email").classList.remove("is-valid");
        document.getElementById("email").classList.add("is-invalid");
    }
}

function validatePw() {
    let pattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-={[}\]|\\:;"<>,.?/]{8,32}$/;

    if (pattern.test(document.getElementById("pw").value)){
        document.getElementById("pw").classList.remove("is-invalid");
        document.getElementById("pw").classList.add("is-valid");
        correctPw = true;
    } else {
        correctPw = false;
        document.getElementById("pw").classList.remove("is-valid");
        document.getElementById("pw").classList.add("is-invalid");
    }
}

function login(){
    let loginMessage = document.getElementById("allfieldsrequired");

    if (correctEmail && correctPw){
        let formData = new FormData(document.getElementById("login"));
        formData.append("f", "login");   

        fetch("adat.php", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if(response.ok){
                return response.text();
            } 

            return Promise.reject(response);
        })
        .then(request => {
            if(request == 1) {
                window.location.assign("status.html");
            } else if(request == 0) {
                loginMessage.innerHTML = "Sikertelen bejelentkezés, hibás email cím vagy jelszó!";
                loginMessage.style.display = "block";
            }
        })
        .catch(response => {
            loginMessage.innerHTML = "Sikertelen bejelentkezés, próbáld újra!<br>Hibakód: " + response.status + " " + response.statusText;
            loginMessage.style.display = "block";
        })

        document.getElementById("email").value = "";
        document.getElementById("email").classList.remove("is-valid");
        document.getElementById("email").classList.remove("is-invalid");

        document.getElementById("pw").value = "";
        document.getElementById("pw").classList.remove("is-valid");
        document.getElementById("pw").classList.remove("is-invalid");

        loginMessage.style.display = "none";
    } else {
        loginMessage.innerHTML = "Minden mező kitöltése kötelező!";
        loginMessage.style.display = "block";
    }
}