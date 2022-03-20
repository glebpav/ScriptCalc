function saveToken(token) {
    localStorage.setItem('token', token);
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
}

function loadUser() {
    return JSON.parse(localStorage.getItem("user"))
}

function loadToken() {
    return JSON.parse(localStorage.getItem("token"))
}

function onMakeScript() {
    let name = document.getElementById("inputName").value
    let login = document.getElementById("inputLogin").value
    let password = document.getElementById("inputPassword").value
    let password2 = document.getElementById("inputPassword2").value

    console.log(password)
    console.log(password2)

    if (password != password2) {
        alert("Passwords are not the same")
        return 0
    }
/*
    localhost:8081/auth/login
    localhost:8081/auth/register
*/
    $.ajax({
        url: 'localhost:8081/auth/register',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            "name": name,
            "login": login,
            "password": password,
        },
        success: function (data) {
            alert(data);
        }
    });

    $.ajax({
        url: '/createUser',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            "name": name,
            "login": login,
            "password": password,
        },
        success: function (data) {
            alert(data);
        }
    });
}

function onLogIn() {
    let login = document.getElementById("inputLogin").value
    let password = document.getElementById("inputPassword").value

    $.ajax({
        url: 'auth/login',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            "login": login,
            "password": password,
        },
        error: function(xhr, status, message) {
            alert(message)
        },
        success: function (data) {
            console.log(data)
            
            let response = JSON.parse(data)
            let user = response.user

            saveToken(response.token)
            saveUser(user)

            window.location.replace("/home.html");
        }
    });
}

function btnBackClicked() {
    window.location.replace("/greeting.html");
}