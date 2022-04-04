
function onLogIn() {
    let login = document.getElementById("inputLogin").value
    let password = document.getElementById("inputPassword").value

    $.ajax({
        url: 'auth/login',
        cache: false,
        xhrFields: {withCredentials: true},
        method: 'post',
        dataType: 'html',
        data: {
            "login": login,
            "password": password,
        },
        error: function (xhr, status, message) {
            alert(message)
        },
        success: function (output) {

            let response = JSON.parse(output);
            let user = response.user;

            saveToken(response.token);
            saveUser(user);

            window.location.replace("/home.html");
        }
    });
}

function btnBackClicked() {
    window.location.replace("/greeting.html");
}