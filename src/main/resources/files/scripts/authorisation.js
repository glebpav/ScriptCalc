function saveToken(token) {
    localStorage.setItem('token', token);
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
}

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
        success: function (output, status, xhr) {

            console.log(xhr.getResponseHeader('Set-Cookie'))
            console.log(xhr)

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