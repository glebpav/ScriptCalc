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
        xhrFields: { withCredentials: true },
        method: 'post',
        dataType: 'html',
        data: {
            "login": login,
            "password": password,
        },
        error: function(xhr, status, message) {
            alert(message)
        },
        success: function (output, status, xhr) {


            let response = JSON.parse(output);
            let user = response.user;

            // console.log(output)
            // console.log(response.token);
            // console.log(response.user);

            saveToken(response.token);
            saveUser(user);

            window.location.replace("/home.html");
        }
    });
}

function btnBackClicked() {
    window.location.replace("/greeting.html");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}
