loadAllScripts()

function loadUser() {
    return JSON.parse(localStorage.getItem("user"))
}

function loadToken() {
    return localStorage.getItem("token")
}

function setTitle() {
    document.getElementById("greetingTitleId").innerText = "Hello, " + loadUser().name
}

function loadAllScripts() {

    let token = loadToken()

    $.ajax({
        type: "GET",
        url: '/script/loadAll?token=' + token,
        cache: false,
        dataType : 'html',
        success: function(data) {

            let jsonData = JSON.parse(data)

            for (let i = 0; i < jsonData.length; i++) {
                console.log(jsonData[i])
            }

            return jsonData

        }
    });

    return undefined

}

function printScripts() {

    let scriptsArray = loadAllScripts()

    let horizontalDivArray;
    let horizontalDiv;
    let cardDiv;
    let titleP;
    let descP;
    let goToScriptBtn;

    let scriptId;

    for (let i = 0; i < scriptsArray.size(); i++) {

        scriptId = scriptsArray[i].id

        horizontalDiv = document.createElement("div");
        cardDiv = document.createElement("div");
        titleP = document.createElement("p");
        descP = document.createElement("p");
        goToScriptBtn = document.createElement("button");

        titleP.innerText = scriptsArray[i].name;
        descP.innerText = scriptsArray[i].description;
        goToScriptBtn.setAttribute("onClick", "goToScript(" + scriptId + ")");

        horizontalDiv.appendChild(titleP)
        horizontalDiv.appendChild(titleP)
        horizontalDiv.appendChild(goToScriptBtn)
        horizontalDivArray.add(horizontalDiv)

    }

    for (let i = 0; i < horizontalDivArray.length; i += 1) {

    }

}
