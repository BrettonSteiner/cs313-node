function userInfo() {
    $.ajax({
        type: "GET",
        url: '/isLoggedIn',
        success: userInfoResults
    });
}

function userInfoResults(result) {
    if (result.success) {
        var html = '<span><span class="user">' + result.username + '</span><a href="/logout"><button type="button" class="btn btn-light">Logout</button></a><span>';
        $("#userInfo").html(html);
        $("#navbar").show();
    }
    else {
        var html = '<a href="/sign-in"><button type="button" class="btn btn-light">Login</button></a>';
        $("#userInfo").html(html);
        $("#navbar").hide();
    }
}

function getInfo() {
    var majorName = $("#majorName").val();
    var complex = $("#complex").val();
    var apartment = $("#apartment").val();

    var initialModalHtml = '<div id="majorResults"></div><div id="iTeamResults"></div><div id="mentorResults"></div>'
    $("#modalBody").html(initialModalHtml);
    $("#modalTitle").text("Get Connected Information Results");

    if (majorName != "") {
        var data = {
            "majorName": majorName
        }

        $.ajax({
            type: "GET",
            url: '/getMajorColor',
            data: data,
            success: majorColor
        })
    }

    if (complex != "" && apartment != "") {
        var data = {
            "complex": complex,
            "apartment": apartment
        }

        $.ajax({
            type: "GET",
            url: '/getITeamNumber',
            data: data,
            success: iTeamNumber
        })
    }
}

function majorColor(results) {
    if (results != undefined) {
        var html = '<h3>Major Color:</h3><h6>' + results + '</h6>';
        $("#majorResults").html(html);
        $("#myModal").modal('show');
    }
}

function iTeamNumber(results) {
    if (results != undefined) {

        if (Number.isInteger(results)) {
            var data = {
                "iteamNumber": results
            }

            $.ajax({
                type: "GET",
                url: '/getMentorInfo',
                data: data,
                success: mentorInfo
            })
        }

        var html = '<h3>I-Team Number:</h3><h6>' + results + '</h6>';
        $("#iTeamResults").html(html);
        $("#myModal").modal('show');
    }
}

function mentorInfo(results) {
    if (results != undefined) {
        var html = '<h3>Mentors:</h3>';
        $.each(results, function(index, result) {
            html += '<h6>' + result.name + ': ' + result.phone + '</h6>';
        });
        $("#mentorResults").html(html);
    }
}