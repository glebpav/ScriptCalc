let inputsArray = []
let alreadyCalculated = false

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getOutputParamEl(param) {

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
    let scriptId = getParameterByName('id');
    let inputArray = [];
    let inputsStr = "( "

    let param;
    for (let i = 0; i < inputs.length; i += 1) {
        param = {};
        param.number = inputs[i].getElementsByTagName("input")[0].value;
        param.paramName = inputs[i].getElementsByTagName("p")[0].innerHTML;
        inputArray.push(param);
        inputsStr += String(param.paramName) + " = " +  String(param.number);
        if (i !== inputs.length-1) inputsStr += "; "
    }
    inputsStr += " )"

    $.ajax({
        url: '/calculateScript',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            'scriptId': scriptId,
            'inputParams': JSON.stringify(inputArray)
        },
        success: function (data) {
            let inputData = JSON.parse(data)

            if (inputData.length === 0) {
                alert("Error: empty response!");
                return
            }
            let rootPlaceHolder = document.getElementById("palaceHolder")

            if (!alreadyCalculated) {
                let titleOutput = document.createElement("p")
                titleOutput.setAttribute("style", "text-align: left; margin-left: 220px")
                titleOutput.innerHTML = "Output params"
                rootPlaceHolder.appendChild(titleOutput)
            }

            alreadyCalculated = true

            let paramInputEl = document.createElement("p");
            // paramInputEl.setAttribute("style", "text-align: left; margin-left: 220px");
            // paramInputEl.setAttribute("class", "block");
            paramInputEl.innerHTML = inputsStr;
            rootPlaceHolder.appendChild(paramInputEl)

            for (let i = 0; i < inputData.length; i++) {
                rootPlaceHolder.appendChild(getOutputParamEl(inputData[i]))
            }

            // alert(inputData);
        }
    });

}