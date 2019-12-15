var colleges = [];
var complexes = [];
var iteams = [];

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
    }
}

function clickMajors() {
    if (!$("#majorsTab").hasClass("active")) {
        $("#majorsTab").addClass("active");
        $("#complexesTab").removeClass("active");
        $("#apartmentsTab").removeClass("active");

        if (colleges.length == 0)
            getColleges();

        $("#recordsTable").DataTable().clear().destroy();
        $("#tableHead").html("<tr><th>Record Id</th><th>Major Name</th><th>College Id</th></tr>");
        getMajors();
    }
}

function clickComplexes() {
    if (!$("#complexesTab").hasClass("active")) {
        $("#majorsTab").removeClass("active");
        $("#complexesTab").addClass("active");
        $("#apartmentsTab").removeClass("active");

        $("#recordsTable").DataTable().clear().destroy();
        $("#tableHead").html("<tr><th>Record Id</th><th>Complex Name</th></tr>");
        getComplexes(getComplexResults);
    }
}

function clickApartments() {
    if (!$("#apartmentsTab").hasClass("active")) {
        $("#majorsTab").removeClass("active");
        $("#complexesTab").removeClass("active");
        $("#apartmentsTab").addClass("active");

        if (iteams.length == 0)
            getITeams();
        if (complexes.length == 0)
            getComplexes(getComplexArrayResults);

        $("#recordsTable").DataTable().clear().destroy();
        $("#tableHead").html("<tr><th>Record Id</th><th>Apartment Number</th><th>Complex Id</th><th>I-Team Id</th></tr>");
        getApartments();
    }
}

function getColleges() {
    $.ajax({
        type: "GET",
        url: '/getColleges',
        success: getCollegeResults
    })
}

function getMajors() {
    $("#recordsTable").DataTable().clear().destroy();

    $.ajax({
        type: "GET",
        url: '/getMajors',
        data: {},
        success: getMajorResults
    })
}

function getComplexes(callback) {
    $("#recordsTable").DataTable().clear().destroy();

    $.ajax({
        type: "GET",
        url: '/getComplexes',
        data: {},
        success: callback
    })
}

function getITeams() {
    $.ajax({
        type: "GET",
        url: '/getITeams',
        success: getITeamResults
    })
}

function getApartments() {
    $("#recordsTable").DataTable().clear().destroy();

    $.ajax({
        type: "GET",
        url: '/getApartments',
        data: {},
        success: getApartmentResults
    })
}

function getCollegeResults(results) {
    if (results != "Fail")
        $.each(results, function(index, result) {
            colleges.push({ id: result.id, name: result.name, color: result.color});
        });
}

function getMajorResults(results) {
    if (results == "Fail") {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + result + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
    else {
        var html = '';
        $.each(results, function(index, result) {
            html += '<tr onclick="selectMajorRecord(' + result.id + ')"><td>' + result.id + '</td><td>' + result.name + '</td><td>' + result.collegeid + '</td></tr>';
        });
        $("#searchResults").html(html);
        $("#recordsTable").DataTable();
    }
}

function getComplexArrayResults(results) {
    if (results != "Fail")
        $.each(results, function(index, result) {
            complexes.push({ id: result.id, name: result.name});
        });
}

function getComplexResults(results) {
    if (results == "Fail") {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + result + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
    else {
        var html = '';
        $.each(results, function(index, result) {
            html += '<tr onclick="selectComplexRecord(' + result.id + ')"><td>' + result.id + '</td><td>' + result.name + '</td></tr>';
        });

        if (complexes.length == 0)
            getComplexArrayResults(results);

        $("#searchResults").html(html);
        $("#recordsTable").DataTable();
    }
}

function getITeamResults(results) {
    if (results != "Fail")
        $.each(results, function(index, result) {
            iteams.push({ id: result.id, number: result.number});
        });
}

function getApartmentResults(results) {
    if (results == "Fail") {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + result + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
    else {
        var html = '';
        $.each(results, function(index, result) {
            html += '<tr onclick="selectApartmentRecord(' + result.id + ')"><td>' + result.id + '</td><td>' + result.number + '</td><td>' + result.complexid + '</td><td>' + result.iteamid + '</td></tr>';
        });

        $("#searchResults").html(html);
        $("#recordsTable").DataTable();
    }
}

function selectMajorRecord(id) {
    console.log("Clicked Major record " + id);
    $.ajax({
        type: "GET",
        url: '/getMajor',
        data: { "id": id },
        success: getMajorRecord
    })
}

function selectComplexRecord(id) {
    console.log("Clicked Complex record " + id);
    $.ajax({
        type: "GET",
        url: '/getComplex',
        data: { "id": id },
        success: getComplexRecord
    })
}

function selectApartmentRecord(id) {
    console.log("Clicked Apartment record " + id);
    $.ajax({
        type: "GET",
        url: '/getApartment',
        data: { "id": id },
        success: getApartmentRecord
    })
}

function getMajorRecord(results) {
    if (results == "Fail") {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + results + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
    else {
        console.log(results);
        var modalBody = '<form><div class="form-group"><label for="modalName">Major Name</label><input type="text" class="form-control" id="modalName" placeholder="' + results.name + '" value="' + results.name + '"></div>'
            + '<div class="form-group"><label for="modalCollegeId">College Id</label><select class="form-control" id="modalCollegeId">';
        for (var i = 0; i < colleges.length; i++) {
            modalBody += '<option value="' + colleges[i].id + '"';
            if (colleges[i].id == results.collegeid)
                modalBody += ' selected';
            modalBody += '>' + colleges[i].id + ' - ' + colleges[i].name + '</option>';
        }
        modalBody += '</select></div></form>';
        var modalFooter = '<button class="btn btn-danger mr-auto" type="button" onClick="deleteMajor(' + results.id + ')" data-dismiss="modal">Delete</button>'
            + '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
            + '<button class="btn btn-primary" type="button" onClick="updateMajor(' + results.id + ', ' + results.collegeid + ')" data-dismiss="modal">Save Changes</button>';

        $("#modalTitle").text("Major Record " + results.id);
        $("#modalBody").html(modalBody);
        $("#modalFooter").html(modalFooter);
        $("#myModal").modal({backdrop: 'static', show: true});
    }
}

function getComplexRecord(results) {
    if (results == "Fail") {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + results + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
    else {
        console.log(results);
        var modalBody = '<form><div class="form-group"><label for="modalName">Complex Name</label><input type="text" class="form-control" id="modalName" id="modalName" placeholder="' + results.name + '" value="' + results.name + '"></div></form>';
        var modalFooter = '<button class="btn btn-danger mr-auto" type="button" onClick="deleteComplex(' + results.id + ')" data-dismiss="modal">Delete</button>'
            + '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
            + '<button class="btn btn-primary" type="button" onClick="updateComplex(' + results.id + ')" data-dismiss="modal">Save Changes</button>';

        $("#modalTitle").text("Complex Record " + results.id);
        $("#modalBody").html(modalBody);
        $("#modalFooter").html(modalFooter);
        $("#myModal").modal({backdrop: 'static', show: true});
    }
}

function getApartmentRecord(results) {
    if (results == "Fail") {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + results + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
    else {
        console.log(results);
        var modalBody = '<form><div class="form-group"><label for="modalNumber">Apartment Number</label><input type="text" class="form-control" id="modalNumber" placeholder="' + results.number + '" value="' + results.number + '"></div>'
            + '<div class="form-group"><label for="modalComplexId">Complex Id</label><select class="form-control" id="modalComplexId">';
        for (var i = 0; i < complexes.length; i++) {
            modalBody += '<option value="' + complexes[i].id + '"';
            if (complexes[i].id == results.complexid)
                modalBody += ' selected';
            modalBody += '>' + complexes[i].id + ' - ' + complexes[i].name + '</option>';
        }
        modalBody += '</select></div><div class="form-group"><label for="modaliTeamId">I-Team Id</label><select class="form-control" id="modaliTeamId">';
        for (var i = 0; i < iteams.length; i++) {
            modalBody += '<option value="' + iteams[i].id + '"';
            if (iteams[i].id == results.iteamid)
                modalBody += ' selected';
            modalBody += '>' + iteams[i].id + ' - I-Team Number ' + iteams[i].number + '</option>';
        }
        modalBody += '</select></div></form>';
        var modalFooter = '<button class="btn btn-danger mr-auto" type="button" onClick="deleteApartment(' + results.id + ')" data-dismiss="modal">Delete</button>'
            + '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
            + '<button class="btn btn-primary" type="button" onClick="updateApartment(' + results.id + ', ' + results.iteamid + ', ' + results.iteamid + ')" data-dismiss="modal">Save Changes</button>';

        $("#modalTitle").text("Apartment Record " + results.id);
        $("#modalBody").html(modalBody);
        $("#modalFooter").html(modalFooter);
        $("#myModal").modal({backdrop: 'static', show: true});
    }
}

function updateMajor(id, collegeid) {
    var oldName = $('#modalName').attr('placeholder');
    var newName = $('#modalName').val();
    var newCollegeId = $('#modalCollegeId').val();

    if (oldName != newName || collegeid != newCollegeId) {
        var data = {
            "id": id,
            "name": newName,
            "collegeid": newCollegeId
        }
    
        $.ajax({
            type: "POST",
            url: '/updateMajor',
            data: data,
            success: majorUpdated
        })
    }
}

function updateComplex(id) {
    var oldName = $('#modalName').attr('placeholder');
    var newName = $('#modalName').val();

    if (oldName != newName) {
        var data = {
            "id": id,
            "name": newName
        }
    
        $.ajax({
            type: "POST",
            url: '/updateComplex',
            data: data,
            success: complexUpdated
        })
    }
}

function updateApartment(id, complexid, iteamid) {
    var oldNumber = $('#modalNumber').attr('placeholder');
    var newNumber = $('#modalNumber').val();
    var newComplexId = $('#modalComplexId').val();
    var newiTeamId = $('#modaliTeamId').val();

    if (oldNumber != newNumber || complexid != newComplexId || iteamid != newiTeamId) {
        var data = {
            "id": id,
            "number": newNumber,
            "complexid": newComplexId,
            "iteamid": newiTeamId
        }
    
        $.ajax({
            type: "POST",
            url: '/updateApartment',
            data: data,
            success: apartmentUpdated
        })
    }
}

function majorUpdated(results) {
    if (results == "Success") {
        getMajors();
    }
    else {
        console.log("Error updating major");
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + results + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
}

function complexUpdated(results) {
    if (results == "Success") {
        complexes = [];
        getComplexes(getComplexResults);
    }
    else {
        console.log("Error updating complex");
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + results + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
}

function apartmentUpdated(results) {
    if (results == "Success") {
        getApartments();
    }
    else {
        console.log("Error updating apartment");
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + results + "</p>");
        $("#myModal").modal({backdrop: true, show: true});
    }
}

function deleteMajor(id) {
    var data = {
        "id": id
    }

    $.ajax({
        type: "POST",
        url: '/deleteMajor',
        data: data,
        success: majorUpdated
    })
}

function deleteComplex(id) {
    var data = {
        "id": id
    }

    $.ajax({
        type: "POST",
        url: '/deleteComplex',
        data: data,
        success: complexUpdated
    })
}

function deleteApartment(id) {
    var data = {
        "id": id
    }

    $.ajax({
        type: "POST",
        url: '/deleteApartment',
        data: data,
        success: apartmentUpdated
    })
}

function createNewRecord() {
    if ($("#majorsTab").hasClass("active"))
        createMajorForm();
    else if ($("#complexesTab").hasClass("active"))
        createComplexForm();
    else if ($("#apartmentsTab").hasClass("active"))
        createApartmentForm();
}

function createMajorForm() {
    var modalBody = '<form><div class="form-group"><label for="modalName">Major Name</label><input type="text" class="form-control" id="modalName" placeholder="Major Name"></div>'
        + '<div class="form-group"><label for="modalCollegeId">College Id</label><select class="form-control" id="modalCollegeId">';
    for (var i = 0; i < colleges.length; i++)
        modalBody += '<option value="' + colleges[i].id + '">' + colleges[i].id + ' - ' + colleges[i].name + '</option>';
    modalBody += '</select></div></form>';
    var modalFooter = '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
        + '<button class="btn btn-primary" type="button" onClick="createMajor()" data-dismiss="modal">Create</button>';

    $("#modalTitle").text("Create New Major");
    $("#modalBody").html(modalBody);
    $("#modalFooter").html(modalFooter);
    $("#myModal").modal({backdrop: 'static', show: true});
}

function createComplexForm() {
    var modalBody = '<form><div class="form-group"><label for="modalName">Complex Name</label><input type="text" class="form-control" id="modalName" id="modalName" placeholder="Complex Name"></div></form>';
    var modalFooter = '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
        + '<button class="btn btn-primary" type="button" onClick="createComplex()" data-dismiss="modal">Create</button>';

    $("#modalTitle").text("Create New Complex");
    $("#modalBody").html(modalBody);
    $("#modalFooter").html(modalFooter);
    $("#myModal").modal({backdrop: 'static', show: true});
}

function createApartmentForm() {
    var modalBody = '<form><div class="form-group"><label for="modalNumber">Apartment Number</label><input type="text" class="form-control" id="modalNumber" placeholder="Apartment Number"></div>'
        + '<div class="form-group"><label for="modalComplexId">Complex Id</label><select class="form-control" id="modalComplexId">';
    for (var i = 0; i < complexes.length; i++)
        modalBody += '<option value="' + complexes[i].id + '">' + complexes[i].id + ' - ' + complexes[i].name + '</option>';
    modalBody += '</select></div><div class="form-group"><label for="modaliTeamId">I-Team Id</label><select class="form-control" id="modaliTeamId">';
    for (var i = 0; i < iteams.length; i++)
        modalBody += '<option value="' + iteams[i].id + '">' + iteams[i].id + ' - I-Team Number ' + iteams[i].number + '</option>';
    modalBody += '</select></div></form>';
    var modalFooter = '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
        + '<button class="btn btn-primary" type="button" onClick="createApartment()" data-dismiss="modal">Create</button>';

    $("#modalTitle").text("Create New Apartment");
    $("#modalBody").html(modalBody);
    $("#modalFooter").html(modalFooter);
    $("#myModal").modal({backdrop: 'static', show: true});
}

function createMajor() {
    var name = $('#modalName').val();
    var collegeId = $('#modalCollegeId').val();

    if (name != '' && collegeId != '') {
        var data = {
            "name": name,
            "collegeid": collegeId
        }
    
        $.ajax({
            type: "PUT",
            url: '/createMajor',
            data: data,
            success: majorUpdated
        })
    }
}

function createComplex() {
    var name = $('#modalName').val();

    if (name != '') {
        var data = {
            "name": name
        }
    
        $.ajax({
            type: "PUT",
            url: '/createComplex',
            data: data,
            success: complexUpdated
        })
    }
}

function createApartment() {
    var number = $('#modalNumber').val();
    var complexId = $('#modalComplexId').val();
    var iTeamId = $('#modaliTeamId').val();

    if (number != '' && complexId != '' && iTeamId != '') {
        var data = {
            "number": number,
            "complexid": complexId,
            "iteamid": iTeamId
        }
    
        $.ajax({
            type: "PUT",
            url: '/createApartment',
            data: data,
            success: apartmentUpdated
        })
    }
}