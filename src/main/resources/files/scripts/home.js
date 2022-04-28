function setTitle() {

    let loadedUser = loadUser().name;
    let greetingLabel;

    if (loadedUser != null)
        greetingLabel = "Hello, " + loadUser().name;
    else
       greetingLabel = "Hello, dear engineer";

    document.getElementById("greetingTitleId").innerText = greetingLabel;
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
            document.getElementById("loadingCaption").style.display = "none";
            jsonData = JSON.parse(data);
            printScripts(jsonData);
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

    let idToShowAsDefault;
    let scriptId;
    let textOfDesc;

    tabsWrapper = document.getElementById("tabsWrapper");
    for (let i = 0; i < scriptsArray.length; i++) {

        scriptId = scriptsArray[i].id;
        if (i === 0) idToShowAsDefault = scriptId;
        textOfDesc = scriptsArray[i].description.length === 0 ? " - " : scriptsArray[i].description;

        cardDiv = createElement('div', {
            class: 'rowWithSpace scriptCard',
            onclick: "goToScript(" + scriptId + ")",
            id: "tab" + scriptId,
            title: textOfDesc
        });
        titleP = createElement("h3", {
            innerText: scriptsArray[i].name
        });

        cardDiv.appendChild(titleP);
        tabsWrapper.appendChild(cardDiv);

    }

    goToScript(idToShowAsDefault);

}

function onAddNewScript() {
    window.location.href = "/addScript.html";
}

function goToScript(scriptID) {
    saveScriptId(scriptID);
    setTabSelected(scriptID);
    loadScriptData();
}