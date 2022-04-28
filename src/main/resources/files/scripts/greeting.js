function guestClicked() {
    saveToken(undefined)
    saveUser("")
    window.location.href = "/home.html";
}

function authorisationClicked() {
    window.location.href = "/authorisation.html";
}

function registrationClicked() {
    window.location = "/registration.html";
}