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
    let tabsWrapper
    let titleP;
    let descP;

    let scriptId;
    let textOfDesc;

    tabsWrapper = document.getElementById("tabsWrapper");
    for (let i = 0; i < scriptsArray.length; i++) {

        scriptId = scriptsArray[i].id
        textOfDesc = scriptsArray[i].description.length === 0 ? " - " : scriptsArray[i].description

        cardDiv = createElement('div', {
            class: 'rowWithSpace scriptCard',
            onclick: "goToScript(" + scriptId + ")",
            title: textOfDesc
        });
        titleP = createElement("h3", {
            innerText: scriptsArray[i].name
        });

        cardDiv.appendChild(titleP)
        tabsWrapper.appendChild(cardDiv)

    }
}

function onAddNewScript() {
    window.location.href = "/addScript.html";
}

function goToScript(scriptID) {
    saveScriptId(scriptID);
    loadScriptData()
}