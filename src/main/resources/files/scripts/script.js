
function loadScriptData(scriptID) {

    let id = getParameterByName("id");

    $.ajax({
        url: '/script/load?id=' + id,
        cache: false,
        method: 'get',
        dataType: 'html',
        data: {},
        success: function (data) {
            console.log(data)
        }
    });

}