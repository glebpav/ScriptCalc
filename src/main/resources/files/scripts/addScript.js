// TODO check if all inputs are not empty

let countOfInputParams = 0;
let countOfOutputParams = 0;

$("#files").change(function () {
    let filename = this.files[0].name;
    console.log(filename);
});

function appendScriptElements(parentElement, data) {

    for (let i = 0; i < data.length; i++) {

        let scriptContainer = createElement("div", {
            class: "row",
            align: "left",
        })
        let scriptName = createElement("p", {
            class: "block",
            style: "width: 90%; text-align: left;",
            innerText: data[i].name,
            onclick: "",
        })
        let delIcon = createElement("span", {
            style: "align-items: center",
            class: "material-icons",
            innerText: "clear",
        });

        scriptContainer.appendChild(scriptName);
        scriptContainer.appendChild(delIcon);

        parentElement.appendChild(scriptContainer);
    }

}

function showScripts(data, type) {

    console.log(data, type);

    let scriptHolder;

    if (type === "exe") {

        scriptHolder = document.getElementById("exeScriptsHolder");
        appendScriptElements(scriptHolder, data);

    } else if (type === "ser") {

        scriptHolder = document.getElementById("serScriptsHolder");
        appendScriptElements(scriptHolder, data);

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
            let jsonData = JSON.parse(data );
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

    placeHolder.appendChild(exeScriptsHeader);
    placeHolder.appendChild(exeScriptsContainer);
    placeHolder.appendChild(serScriptsHeader);
    placeHolder.appendChild(serScriptsContainer);

    return placeHolder;
}

function addMore(type) {

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

    newDiv.appendChild(newInput);
    newDiv.appendChild(newInputUnits);

    document.getElementById(namePrefix + "Params").appendChild(newDiv);
}

function delLast(pref) {

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
            window.location = "home.html"
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

    if(tabId === 0) {

        tab0.className = "rowWithSpace selectedTab";
        tab1.className = "rowWithSpace tab";

        tabContent.innerHTML = getAvailableScriptViewer().outerHTML;

        getExecutableScripts();
        getServicedScripts();

    } else if (tabId === 1) {

        tab0.className = "rowWithSpace tab";
        tab1.className = "rowWithSpace selectedTab";

        tabContent.innerHTML = addScriptFormBlock;

    }

}

function onHome() {
    window.location.href= "/home.html";
}