function loadUser() {
    return JSON.parse(localStorage.getItem("user"))
}

function loadToken() {
    return localStorage.getItem("token")
}

function setTitle() {
    document.getElementById("greetingTitleId").innerText = "Hello, " + loadUser().name
}

// setTitle()