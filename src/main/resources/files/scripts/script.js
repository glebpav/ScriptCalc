let alreadyCalculated = false;
let id;

function loadScriptData() {

    id = loadScriptId();

    $.ajax({
        url: '/script/load?id=' + id,
        cache: false,
        method: 'get',
        dataType: 'html',
        data: {},
        success: function (data) {
            printScript(JSON.parse(data))
        }
    });

}

function printScript(scriptData) {

    document.getElementById("scriptNameID").innerText = scriptData.name;
    document.getElementById("scriptDescriptionID").innerText = scriptData.description;

    let paramsPlaceHolder = document.getElementById("allInputsParams");

    for (let i = 0; i < scriptData.inputParams.length; i++) {
        paramsPlaceHolder.appendChild(getInputParamElement(scriptData.inputParams[i]));
    }

}

function getInputParamElement(data) {

    let mainBlock = createElement('div', {
        class: 'row'
    });
    let pHiddenId = createElement('div', {
        hidden: 'true',
        innerText: data.id
    });
    let pName = createElement('p', {
        style: 'text-align: right',
        class: 'block',
        innerText: data.paramName
    });
    let pDel = createElement('p', {
        style: 'width: 40px',
        class: 'block',
        innerText: ' = '
    });
    let inputValue = createElement('input', {
        style: 'width: 100px',
        class: 'block enterTextDown'
    });
    let pUnit = createElement('div', {
        style: 'margin-left: 10px; text-align: left',
        innerText: data.unit,
        class: 'block'
    });

    mainBlock.appendChild(pName);
    mainBlock.appendChild(pHiddenId);
    mainBlock.appendChild(pDel);
    mainBlock.appendChild(inputValue);
    mainBlock.appendChild(pUnit);

    return mainBlock;
}

function getOutputParamElement(param) {

    let paramHolderEl;
    let paramNameEl;
    let paramValueEl;
    let paramUnitsEl
    let paramEqualEl

    paramHolderEl = createElement("div", {
        class: "row"
    });

    paramNameEl = createElement("p", {
        style: "text-align: right",
        class: "block",
        innerText: param.paramName
    });

    paramEqualEl = createElement("p", {
        style: "width: 40px",
        class: "block",
        innerText: " = "
    });

    paramValueEl = createElement("input", {
        style: "width: 100px",
        class: "block enterTextDown",
        readOnly: true,
        value: param.value
    });

    paramUnitsEl = createElement("p", {
        style: "text-align: left; margin-left: 10px",
        class: "block",
        innerText: param.unit
    });

    paramHolderEl.appendChild(paramNameEl)
    paramHolderEl.appendChild(paramEqualEl)
    paramHolderEl.appendChild(paramValueEl)
    paramHolderEl.appendChild(paramUnitsEl)

    return paramHolderEl
}

function printOutputParams(inputData, inputInfo) {

    if (inputData.length === 0) {
        alert("Error: empty response!");
        return
    }

    let rootPlaceHolder = document.getElementById("palaceHolder")

    if (!alreadyCalculated) {

        let titleOutput = createElement("p", {
            id: "titleOutput",
            style: "text-align: left; margin-left: 220px",
            innerText: "Output params",
            class: "subHeaders"
        });

        rootPlaceHolder.appendChild(titleOutput)

    }

    alreadyCalculated = true

    let paramInputEl = createElement("p", {innerText: inputInfo});
    // rootPlaceHolder.appendChild(paramInputEl)
    insertAfter(document.getElementById("titleOutput"), paramInputEl);

    let bufDiv = createElement("div")
    for (let i = 0; i < inputData.length; i++) {
        // rootPlaceHolder.appendChild(getOutputParamElement(inputData[i]))
        bufDiv.appendChild(getOutputParamElement(inputData[i]));
    }

    insertAfter(paramInputEl, bufDiv);

}

function btnCalculate() {

    let inputs = document.getElementById("allInputsParams").getElementsByClassName("row");
    let inputArray = [];
    let inputsStr = "( "

    let param;
    for (let i = 0; i < inputs.length; i += 1) {

        param = {};
        param.id = inputs[i].getElementsByTagName("div")[0].innerText;
        param.value = inputs[i].getElementsByTagName("input")[0].value;
        param.paramName = inputs[i].getElementsByTagName("p")[0].innerText;

        param.scriptID = 0;
        param.unit = "none";
        param.type = "input";

        inputArray.push(param);

        inputsStr += String(param.paramName) + " = " +  String(param.value);
        if (i !== inputs.length-1) inputsStr += "; "

        if (param.value === "") {
            alert("Inputs can't be empty")
            return
        }

    }
    inputsStr += " )"

    $.ajax({
        url: '/script/calculate',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            'scriptId': id,
            'scriptInputParams': JSON.stringify(inputArray)
        },
        success: function (data) {

            printOutputParams(JSON.parse(data), inputsStr);

        }
    });

}

function onHome() {
    window.location.href = "home.html";
}