// TODO check if all inputs are not empty

let allRows = document.getElementsByClassName("row")
let countOfRows = allRows.length

$("#files").change(function () {
    let filename = this.files[0].name;
    console.log(filename);
});

function loadFile(files) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0])
}

function addMore(type) {

    let newDiv;
    let newInput;
    let newInputUnits;
    let newButton;

    newDiv = document.createElement("div");
    newInput = document.createElement("input");
    newInputUnits = document.createElement("input");
    newButton = document.createElement("button");

    newDiv.setAttribute("class", "row");
    newDiv.setAttribute("id", "row" + countOfRows);
    newButton.setAttribute("class", "block delBtn");
    newButton.setAttribute("onclick", "delRow(" + countOfRows + ")");
    newInput.setAttribute("class", "block enterText");
    newInputUnits.setAttribute("class", "block enterText");
    newInput.setAttribute("placeHolder", "Param");
    newInputUnits.setAttribute("placeHolder", "Units");
    newInputUnits.setAttribute("style", "width: 40px; margin-left: 5px");
    newButton.setAttribute("style", "margin-left: 25px");
    newButton.innerHTML = "Del";

    newDiv.appendChild(newInput);
    newDiv.appendChild(newInputUnits);
    countOfRows += 1

    newDiv.appendChild(newButton);
    if (type === "inp") {
        document.getElementById("inputParams").appendChild(newDiv);
    } else if (type === "out") {
        document.getElementById("outputParams").appendChild(newDiv)
    }
}

function delRow(row) {
    document.getElementById("row" + row).remove();
}

function onMakeScript() {
    let outputParams = document.getElementById("outputParams").getElementsByTagName("input")
    let inputParams = document.getElementById("inputParams").getElementsByTagName("input")
    let scriptDescriptionStr = document.getElementById("scriptDescription").value;
    let scriptNameStr = document.getElementById("scriptName").value;
    let scriptPath = document.getElementById("getFile").files;

    let inputParamsStr = ""
    let inputParamsUnitsStr = ""
    let outputParamsStr = ""
    let outputParamsUnitsStr = ""

    for (let i = 0; i < inputParams.length; i += 1) {
        if (i % 2 === 0) inputParamsStr += inputParams[i].value + ","
        else inputParamsUnitsStr += inputParams[i].value + ","
    }
    for (let i = 0; i < outputParams.length; i += 1) {
        if (i % 2 === 0) outputParamsStr += outputParams[i].value + ","
        else outputParamsUnitsStr += outputParams[i].value + ","
    }

    let file = $('form')[0].files[0]; // You need to use standard javascript object here
    let formData1 = new FormData();
    formData1.append("file", file)
    formData1.append("token", loadToken())

    console.log(formData1)

    /*
    let formData = new FormData();
    formData.append('file', $("#getFile")[0].files[0]);
    console.log(formData    )
*/
    $.ajax({
        url: '/script/upload',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: formData1,
        success: function (data) {
            alert(data)
        }
    });

    /*
    $.ajax({
        url: '/createScript',
        cache: false,
        method: 'post',
        dataType: 'html',
        data: {
            "inputParams": inputParamsStr,
            "inputParamsUnits": inputParamsUnitsStr,
            "outputParams": outputParamsStr,
            "outputParamsUnits": outputParamsUnitsStr,
            "scriptDescription": scriptDescriptionStr,
            "scriptName": scriptNameStr
        },
        success: function (data) {
            alert(data);
        }
    });
    */

    return false
}