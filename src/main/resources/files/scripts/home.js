
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

    let token = loadToken();
    let jsonData;

    $.ajax({
        type: "GET",
        url: '/script/loadAll?token=' + token,
        cache: false,
        dataType : 'html',
        success: function(data) {

            jsonData = JSON.parse(data);

            for (let i = 0; i < jsonData.length; i++) {
                console.log(jsonData[i]);
                console.log("hello")
            }
            console.log(jsonData.length)
            printScripts(jsonData)

        }
    });
}

function printScripts(scriptsArray) {

    let placeHolder = document.getElementById("IdScriptHolder ")

    let rowDiv
    let horizontalDivArray = [];
    let goToScriptBtn;
    let cardDiv;
    let titleP;
    let descP;

    let scriptId;

    for (let i = 0; i < scriptsArray.length; i++) {

        scriptId = scriptsArray[i].id

        cardDiv = createElement('div', {class:'block scriptCard'});
        titleP = document.createElement("p");
        descP = document.createElement("p");
        goToScriptBtn = createElement("button", {class: "goToScriptBtn", onclick: "goToScript(" + scriptId + ")"});

        titleP.innerText = scriptsArray[i].name;
        let textOfDesc = scriptsArray[i].description
        if (textOfDesc.length > 50) descP.innerText = textOfDesc.substring(0, 50) + "...";
        else descP.innerText = textOfDesc

        cardDiv.appendChild(titleP)
        cardDiv.appendChild(descP)
        cardDiv.appendChild(goToScriptBtn)
        horizontalDivArray.push(cardDiv)

    }

    let buf = 0;
    rowDiv = createElement("div", {class: "row"});
    for (let i = 0; i < horizontalDivArray.length; i += 1) {
        if (buf < 2 && i !== horizontalDivArray.length-1) rowDiv.appendChild(horizontalDivArray[i]);
        else {
            rowDiv.appendChild(horizontalDivArray[i])
            placeHolder.appendChild(rowDiv)
            rowDiv = createElement("div", {class: "row"});
            buf = -1
        }
        buf += 1
    }

}

function goToScript(scriptID) {
    window.location.href = '/script?id=' + scriptID;
}