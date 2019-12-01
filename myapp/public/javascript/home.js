function getInfo() {
    var majorName = $("#majorName").val();
    var complex = $("#complex").val();
    var apartment = $("#apartment").val();

    if (majorName != "") {
        var data = {
            "majorName": majorName
        }

        $.ajax({
            type: "GET",
            url: '/getMajorInfo',
            data: data,
            success: majorInfo
        })
    }

    if (complex != "" && apartment != "") {
        var data = {
            "complex": complex,
            "apartment": apartment
        }

        $.ajax({
            type: "GET",
            url: '/getITeamInfo',
            data: data,
            success: iTeamInfo
        })
    }
}

function majorInfo(results) {
    if (results != undefined)
        $("#majorResults").text(results);
}

function iTeamInfo(results) {
    if (results != undefined)
        $("#iTeamResults").text(results);
}