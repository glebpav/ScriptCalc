
function registerUser() {

    let login = document.getElementById("inputLogin").value
    let name = document.getElementById("inputName").value
    let password = document.getElementById("inputPassword").value
    let password2 = document.getElementById("inputPassword2").value
    let inviteCode = document.getElementById("invitecode").value

    if (password !== password2) {
        alert("Passwords are not the same")
        return 0
    }

    document.getElementById("regButton").enabled = false
    document.getElementById("regButton").innerHTML = "Loading..."

    $.ajax({
        url: 'auth/register',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            "login": login,
            "password": password,
            "name": name,
            "invitecode": inviteCode
        },
        error: function (xhr, status, message) {
            document.getElementById("regButton").enabled = true
            document.getElementById("regButton").innerHTML = "Create user"
            alert(message);
        },
        success: function (data) {
            window.location.href = "/authorisation.html"
        },
    });
}

function onHome() {
    window.location.href = "/greeting.html";
}