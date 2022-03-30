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
            console.log(JSON.parse(data))
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

    let mainBlock = createElement('div', {class: 'row'});
    let pHiddenId = createElement('div', {hidden: 'true', innerText: data.id});
    let pName = createElement('p', {style: 'text-align: right', class: 'block', innerText: data.paramName});
    let pDel = createElement('p', {style: 'width: 40px', class: 'block', innerText: ' = '});
    let inputValue = createElement('input', {style: 'width: 100px', class: 'block enterTextDown'});
    let pUnit = createElement('div', {style: 'margin-left: 10px; text-align: left', class: 'block', innerText: data.unit});

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

    paramHolderEl = document.createElement("div");
    paramHolderEl.setAttribute("class", "row");

    /*
    paramInputEl = document.createElement("p");
    paramInputEl.setAttribute("style", "text-align: left");
    // paramInputEl.setAttribute("class", "block");
    paramInputEl.innerHTML = param.paramName;
     */

    paramNameEl = document.createElement("p");
    paramNameEl.setAttribute("style", "text-align: right");
    paramNameEl.setAttribute("class", "block");
    paramNameEl.innerHTML = param.paramName;

    paramEqualEl = document.createElement("p");
    paramEqualEl.setAttribute("style", "width: 40px");
    paramEqualEl.setAttribute("class", "block");
    paramEqualEl.innerHTML =  " = ";

    paramValueEl = document.createElement("input");
    paramValueEl.setAttribute("style", "width: 100px");
    paramValueEl.setAttribute("class", "block enterTextDown");
    paramValueEl.setAttribute("readonly", "");
    paramValueEl.setAttribute("value", param.value);

    paramUnitsEl = document.createElement("p");
    paramUnitsEl.setAttribute("style", "text-align: left; margin-left: 10px");
    paramUnitsEl.setAttribute("class", "block");
    paramUnitsEl.innerHTML = param.unit;

    // paramHolderEl.appendChild(paramInputEl)
    paramHolderEl.appendChild(paramNameEl)
    paramHolderEl.appendChild(paramEqualEl)
    paramHolderEl.appendChild(paramValueEl)
    paramHolderEl.appendChild(paramUnitsEl)

    return paramHolderEl
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
        inputArray.push(param);

        inputsStr += String(param.paramName) + " = " +  String(param.value);
        if (i !== inputs.length-1) inputsStr += "; "

    }
    inputsStr += " )"

    $.ajax({
        url: '/script/calculate',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            'scriptId': id,
            'inputParams': JSON.stringify(inputArray)
        },
        success: function (data) {

            console.log(JSON.parse(data));
            printOutputParams(JSON.parse(data), inputsStr);

        }
    });

}

function printOutputParams(inputData, inputInfo) {

    if (inputData.length === 0) {
        alert("Error: empty response!");
        return
    }

    let rootPlaceHolder = document.getElementById("palaceHolder")

    if (!alreadyCalculated) {

        let titleOutput = createElement("p", {style: "text-align: left; margin-left: 220px", innerText: "Output params"});
        rootPlaceHolder.appendChild(titleOutput)

    }

    alreadyCalculated = true

    let paramInputEl = createElement("p", {innerText: inputInfo});
    rootPlaceHolder.appendChild(paramInputEl)

    for (let i = 0; i < inputData.length; i++) {
        rootPlaceHolder.appendChild(getOutputParamElement(inputData[i]))
    }

}