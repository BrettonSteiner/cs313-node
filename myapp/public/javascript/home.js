var collegeResult = false;
var iTeamResult = false;

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
    collegeResult = false;
    iTeamResult = false;
    var majorName = $("#majorName").val();
    var complex = $("#complex").val();
    var apartment = $("#apartment").val();

    var initialModalHtml = '<div id="row"><div id="majorResults"></div><div id="iTeamResults"></div></div><div id="mentorResults"></div>'
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
    if (results != undefined ) {
        if (results != "Unknown major") {
            var html = '<div class="infoResult"><h5>College</h5><div class="' + results.color + '"><p>' + results.color + '<br><br><span>' + results.name + '</span></p></div></div>';
            $("#majorResults").html(html);
            collegeResult = true;
            makeRow();
        }
        else {
            var html = '<div class="infoResult"><h6>' + results + '</h6>';
            $("#majorResults").html(html);
        }
        $("#myModal").modal('show');
    }
}

function iTeamNumber(results) {
    if (results != undefined) {
        if (!isNaN(results)) {
            var data = {
                "iteamNumber": results
            }

            $.ajax({
                type: "GET",
                url: '/getMentorInfo',
                data: data,
                success: mentorInfo
            })

            var html = '<div class="infoResult"><h5>I-Team</h5><div class="';
            if (results % 2 === 0)
                html += 'Even';
            else
                html += 'Odd';
            html += '"><span>' + results + '</span></div></div>';
            $("#iTeamResults").html(html);
            iTeamResult = true;
            makeRow();
        }
        else {
            var html = '<br><div class="infoResult"><h6>' + results + '</h6>';
            $("#mentorResults").html(html);
        }
        $("#myModal").modal('show');
    }
}

function mentorInfo(results) {
    if (results != undefined) {
        var html = '<br><div class="infoResult"><h5>Mentors</h5>';
        $.each(results, function(index, result) {
            html += '<h6>' + result.name + ': ' + result.phone + '</h6>';
        });
        html += '</div>';
        $("#mentorResults").html(html);
    }
}

function makeRow() {
    if (collegeResult && iTeamResult) {
        $("#row").addClass("form-row");
        $("#majorResults").addClass("form-group col-md-6");
        $("#iTeamResults").addClass("form-group col-md-6");
        collegeResult = false;
        iTeamResult = false;
    }
}

function initializeAutocomplete() {
    $.ajax({
        type: "GET",
        url: '/getMajorNames',
        success: startMajorAutocomplete
    })

    $.ajax({
        type: "GET",
        url: '/getComplexNames',
        success: startComplexAutocomplete
    })
}

function refreshApartmentAutocomplete() {
    var complexName = $("#complex").val();

    $.ajax({
        type: "GET",
        url: '/getApartmentNumbers',
        data: { complex: complexName },
        success: startApartmentAutocomplete
    })
}

function startMajorAutocomplete(results) {
    if (results != "Fail") {
        var majorNames = [];
        for (var i = 0; i < results.length; i++) {
            majorNames.push(results[i].name);
        }

        $("#majorName").autocomplete({
            source: majorNames
        });
    }
}

function startComplexAutocomplete(results) {
    if (results != "Fail") {
        var complexNames = [];
        for (var i = 0; i < results.length; i++) {
            complexNames.push(results[i].name);
        }

        $("#complex").autocomplete({
            source: complexNames
        });
    }
}

function startApartmentAutocomplete(results) {
    if (results != "Fail") {
        var apartmentNumbers = [];
        for (var i = 0; i < results.length; i++) {
            apartmentNumbers.push(results[i].number);
        }

        $("#apartment").autocomplete({
            source: apartmentNumbers
        });
    }
}