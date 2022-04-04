// TODO check if all inputs are not empty

let countOfInputParams = 0;
let countOfOutputParams = 0;

$("#files").change(function () {
    let filename = this.files[0].name;
    console.log(filename);
});

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

function onHome() {
    window.location.href= "/home.html";
}