


function setTitle() {
    if(loadUser() != null)
        document.getElementById("greetingTitleId").innerText = "Hello, " + loadUser().name
/*
    let token = loadToken();
    console.log(token)
    if (!token) {
        document.getElementById("btnAddNewScript").disabled = true;
    }
*/
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

            for (let i = 0; i < jsonData.length; i++) {
                console.log(jsonData[i]);
                console.log("hello")
            }
            console.log(jsonData.length)
            printScripts(jsonData)

        }
    });

    return undefined

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

        cardDiv = createElement('div', {class: 'rowWithSpace scriptCard'});
        titleP = document.createElement("h3");
        descP = createElement("p", {style: "font-size: 0.9em;"});
        goToScriptBtn = createElement("button", {
            class: "goToScriptBtn",
            onclick: "goToScript(" + scriptId + ")",
            innerText: "calc"
        });

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
    rowDiv = createElement("div", {class: "row div-floating"});
    for (let i = 0; i < horizontalDivArray.length; i += 1) {
        /*
        if (buf < 2 && i !== horizontalDivArray.length - 1) rowDiv.appendChild(horizontalDivArray[i]);
        else {
            rowDiv.appendChild(horizontalDivArray[i])
            placeHolder.appendChild(rowDiv)
            rowDiv = createElement("div", {class: "row div-floating"});
            buf = -1
        }
        buf += 1

         */
        placeHolder.appendChild(horizontalDivArray[i])
    }

}

function onAddNewScript() {
    window.location.href = "/addScript.html";
}

function goToScript(scriptID) {
    console.log(scriptID);
    saveScriptId(scriptID);
    window.location.href = "/script.html";
}