document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("status").addEventListener("click", statusPage);
    document.getElementById("curr-address").addEventListener("click", currAddress);
    document.getElementById("map-icon").addEventListener("click", mapPage);
    document.getElementById("previous").addEventListener("click", previousAddress);
})

async function statusPage(){
    if (await checkstatus() == true) {
        window.location.assign("status.html");
    } else {
        window.location.assign("index.html");
    }
}

function currAddress(){
    window.location.assign("address.html");
}

function mapPage(){
    window.location.assign("map.html");
}

function previousAddress(){
    window.location.assign("prevadd.html");
}