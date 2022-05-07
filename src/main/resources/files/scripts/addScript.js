// TODO check if all inputs are not empty

let countOfInputParams = 0;
let countOfOutputParams = 0;

$("#files").change(function () {
    let filename = this.files[0].name;
    console.log(filename);
});

function appendScriptElements(parentElement, data, type) {

    for (let i = 0; i < data.length; i++) {

        let scriptContainer = createElement("div", {
            class: "verticalScriptListItem",
            style: "cursor: pointer; text-align: center; display: flex; flex-flow: row wrap; ",
            align: "left",
        })
        let scriptName = createElement("p", {
            class: "rowWithSpace",
            style: "height: 38px; width: 90%; text-align: left; margin-left: 30px; margin-top: 8px;",
            innerText: "- " + data[i].name,
            onclick: (type === "exe") ? "onExeScriptClicked(" + JSON.stringify(data[i]) + ")" : "",
        })
        let delIcon = createElement("span", {
            style: "width: 6%; margin-top: 8px; ",
            class: "rowWithSpace material-icons",
            innerText: "clear",
            onclick: "onDeleteScript("+ data[i].id +")"
        });

        scriptContainer.appendChild(scriptName);
        scriptContainer.appendChild(delIcon);
        parentElement.appendChild(scriptContainer);
    }
}

function showScripts(data, type) {

    let scriptHolder;

    if (type === "exe") {

        scriptHolder = document.getElementById("exeScriptsHolder");
        appendScriptElements(scriptHolder, data, type);

    } else if (type === "ser") {

        scriptHolder = document.getElementById("serScriptsHolder");
        appendScriptElements(scriptHolder, data, type);

    }

}

function getExecutableScripts() {

    let token = loadToken();

    $.ajax({
        type: "GET",
        url: '/script/loadAllExecutable?token=' + token,
        cache: false,
        dataType: 'html',
        success: function (data) {
            let jsonData = JSON.parse(data);
            showScripts(jsonData, "exe");
        }
    });

}

function getServicedScripts() {

    let token = loadToken();

    $.ajax({
        type: "GET",
        url: '/script/loadAllServiced?token=' + token,
        cache: false,
        dataType: 'html',
        success: function (data) {
            let jsonData = JSON.parse(data);
            showScripts(jsonData, "ser");
        }
    });

}

function getAvailableScriptViewer() {

    let placeHolder = createElement("div", {
        id: "scriptsHolder",
        style: "padding-left: 30px; padding-right: 30px",
    });

    let exeScriptsHeader = createElement("h3", {
        innerText: "Executable scripts:",
        style: "text-align: left;",
    })
    let serScriptsHeader = createElement("h3", {
        innerText: "Serviced scripts:",
        style: "text-align: left;",
    })
    let exeScriptsContainer = createElement("div", {
        id: "exeScriptsHolder",
        style: "align"
    });
    let serScriptsContainer = createElement("div", {
        id: "serScriptsHolder",
    });
    let tipToExeScripts = createElement("p", {
        style: "text-align: left",
        innerText: "Tip: you can press any exe script to refactor its settings"
    });

    placeHolder.appendChild(exeScriptsHeader);
    placeHolder.appendChild(tipToExeScripts);
    placeHolder.appendChild(exeScriptsContainer);
    placeHolder.appendChild(serScriptsHeader);
    placeHolder.appendChild(serScriptsContainer);

    return placeHolder;
}

// listeners

function onAddMoreParams(type, name = "", units = "") {

    let namePrefix = (type === "inp") ? "input" : "output";
    let rowId = (type === "inp") ? ++countOfInputParams : ++countOfOutputParams;

    let newDiv = createElement("div", {class: "row"});
    let newInput = createElement("input", {
        name: namePrefix + "Params[" + rowId + "]",
        class: "block enterText",
        placeHolder: "Param"
    });
    let newInputUnits = createElement("input", {
        class: "block enterText",
        placeHolder: "Units",
        name: namePrefix + "ParamsUnits[" + rowId + "]",
        style: "width: 40px; margin-left: 5px"
    });

    if (name !== "") newInput.value = name;
    if (units !== "") newInputUnits.value = units;

    newDiv.appendChild(newInput);
    newDiv.appendChild(newInputUnits);

    document.getElementById(namePrefix + "Params").appendChild(newDiv);
}

function onDelLastParam(pref) {

    let prefix;

    if (pref === "inp") {

        if (countOfInputParams === 0) {
            alert("There mush be at least one param");
            return;
        }
        countOfInputParams--;
        prefix = "input";

    } else {

        if (countOfOutputParams === 0) {
            alert("There mush be at least one param");
            return;
        }
        countOfOutputParams--;
        prefix = "output";

    }

    let rows = document.getElementById(prefix + "Params").getElementsByClassName("row");
    rows[rows.length - 1].remove();

}

function onMakeScript() {
    let form = document.getElementsByTagName("form")[0]

    let formData = new FormData(form);

    $.ajax({
        type: "POST",
        url: '/script/upload?token=' + loadToken(),
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (data) {
            // window.location = "home.html"
        },
        error: function (xhr, status, message) {
            alert(message);
        }
    });

}

function onTabClicked(tabId) {

    let tab0 = document.getElementById("availableScriptsTab");
    let tab1 = document.getElementById("addNewScriptTab");
    let tabContent = document.getElementById("tabWrapper");

    if (tabId === 0) {

        tab0.className = "rowWithSpace selectedTab";
        tab1.className = "rowWithSpace tab";

        tabContent.innerHTML = getAvailableScriptViewer().outerHTML;

        getExecutableScripts();
        getServicedScripts();

    } else if (tabId === 1) {

        tab0.className = "rowWithSpace tab";
        tab1.className = "rowWithSpace selectedTab";

        tabContent.innerHTML = addScriptFormBlock;
        onScrTypeClicked(0);

    }

}

function onExeScriptClicked(scriptData) {

    onTabClicked(1);
    console.log(scriptData)

    document.getElementById("scriptName").value = scriptData.name;
    document.getElementById("scriptDescription").value = scriptData.description;

    console.log(scriptData.inputParams);
    console.log(scriptData.outputParams);

    countOfInputParams = 0;
    countOfOutputParams = 0;

    document.getElementById("inputParams").innerHTML = "";
    for (let i = 0; i < scriptData.inputParams.length; i++) {
        onAddMoreParams(
            "inp",
            scriptData.inputParams[i].paramName,
            scriptData.inputParams[i].unit
        );
    }

    document.getElementById("outputParams").innerHTML = "";
    for (let i = 0; i < scriptData.outputParams.length; i++) {
        onAddMoreParams(
            "out",
            scriptData.outputParams[i].paramName,
            scriptData.outputParams[i].unit
        );
    }


}

function onReturnHome() {
    window.location.href = "/home.html";
}

function onScrTypeClicked(typeId) {

    let tab0 = document.getElementById("exeScrTypeTab");
    let tab1 = document.getElementById("serScrTypeTab");
    let tabContent = document.getElementById("helperInfoWrapper");
    let scriptDescHolder = document.getElementById("scriptDescriptionHolder");

    if (typeId === 0) {

        tab0.className = "rowWithSpace typeSwitcherSelected";
        tab1.className = "rowWithSpace typeSwitcher";

        tabContent.innerText = "Executable script appears on the home page and can operate with serviced scripts.";
        scriptDescHolder.innerHTML = exeScriptBlock;

    } else if (typeId === 1) {

        tab0.className = "rowWithSpace typeSwitcher";
        tab1.className = "rowWithSpace typeSwitcherSelected";

        tabContent.innerText = "Serviced scripts are hidden from usual users. Use them to help operate executable scripts.";
        scriptDescHolder.innerHTML = serScriptBlock;

    }

}

function onDeleteScript(scriptID) {
    $.ajax({
        type: "POST",
        url: '/script/delete?token=' + loadToken(),
        cache: false,
        data: {id: scriptID},
        success: function (data) {
            window.location = "addScript.html";
        },
        error: function (xhr, status, message) {
            alert(message);
        }
    });
}