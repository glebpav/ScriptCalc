let createElement = function (type, props) {
    const $e = document.createElement(type);

    for (const prop in props) {
        if (prop === "innerText") $e.innerText = props[prop]
        else $e.setAttribute(prop, props[prop]);
    }

    return $e;
};

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadUser() {
    return JSON.parse(localStorage.getItem("user"))
}

function loadToken() {
    return localStorage.getItem("token")
}

function saveToken(token) {
    localStorage.setItem('token', token);
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
}

function saveScriptId(id) {
    localStorage.setItem("scriptId", id)
}

function loadScriptId() {
    return localStorage.getItem("scriptId")
}