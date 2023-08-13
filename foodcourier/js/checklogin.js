async function checkstatus() {
    let formData = new FormData();
    formData.append("f", "checkLogin");

    let alert = document.getElementById("loginerror");

   
    let response = await fetch("adat.php", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        let request = await response.json();

        return request;
    } else {
        alert.classList.add("show");
        alert.children[0].innerHTML = "Sikertelen bejelentkezési státusz ellenőrzés. Hibakód: " + response.status + " " + response.statusText;
    }
}