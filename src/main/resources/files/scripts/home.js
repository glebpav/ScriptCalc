function setTitle() {
    if (loadUser() != null)
        document.getElementById("greetingTitleId").innerText = "Hello, " + loadUser().name
}

function loadAllScripts() {

    let token = loadToken();
    let jsonData;

    $.ajax({
        type: "GET",
        url: '/script/loadAll?token=' + token,
        cache: false,
        dataType: 'html',
        success: function (data) {
            //hide loading caption
            document.getElementById("loadingCaption").style.display = "none"
            jsonData = JSON.parse(data);
            printScripts(jsonData)
        }
    });

    return undefined

}

function printScripts(scriptsArray) {

    let placeHolder = document.getElementById("IdScriptHolder")

    let horizontalDivArray = [];
    let goToScriptBtn;
    let cardDiv;
    let rowDiv
    let titleP;
    let descP;

    let scriptId;
    let textOfDesc;

    for (let i = 0; i < scriptsArray.length; i++) {

        scriptId = scriptsArray[i].id
        textOfDesc = scriptsArray[i].description.length === 0 ? " - " : scriptsArray[i].description

        cardDiv = createElement('div', {
            class: 'rowWithSpace scriptCard'
        });
        titleP = createElement("h3", {
            innerText: scriptsArray[i].name
        });
        descP = createElement("p", {
            innerText: (textOfDesc.length > 50) ? textOfDesc.substring(0, 50) + "..." : textOfDesc,
            style: "font-size: 0.9em;"
        });
        goToScriptBtn = createElement("button", {
            class: "goToScriptBtn",
            onclick: "goToScript(" + scriptId + ")",
            innerText: "calc"
        });

        cardDiv.appendChild(titleP)
        cardDiv.appendChild(descP)
        cardDiv.appendChild(goToScriptBtn)
        horizontalDivArray.push(cardDiv)

    }

    let buf = 0;
    rowDiv = createElement("div", {class: "row horizontalWrapper"});
    for (let i = 0; i < horizontalDivArray.length; i += 1) {

        if (buf < 2 && i !== horizontalDivArray.length - 1) rowDiv.appendChild(horizontalDivArray[i]);
        else {
            rowDiv.appendChild(horizontalDivArray[i])
            placeHolder.appendChild(rowDiv)
            rowDiv = createElement("div", {class: "row horizontalWrapper"});
            buf = -1
        }
        buf += 1

        // placeHolder.appendChild(horizontalDivArray[i])
    }
    /*for (let i = 0 ; i < rowDiv.length; i++) {
    }*/
    // placeHolder.appendChild(rowDiv)
}

function onAddNewScript() {
    window.location.href = "/addScript.html";
}

function goToScript(scriptID) {
    saveScriptId(scriptID);
    window.location.href = "/script.html";
}