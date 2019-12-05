function signIn() {
    var username = $("#username").val();
    var password = $("#pwd").val();

    var data = {
        "username": username,
        "password": password
    }
    console.log(data);

    $.ajax({
        type: "POST",
        url: '/login',
        data: data,
        success: logIn
    })
}

function logIn(result) {
    if (result == "Success")
        window.location.href = "/";
    else
        $("#loginError").show();
}

function signUp() {
    console.log("Entered signUp()");
    var username = $("#username").val();
    var password = $("#pwd").val();
    var cpassword = $("#cpwd").val();

    var validUsername = availableUsername(username);
    var validPassword = doPasswordsMatch(password, cpassword);

    if (validUsername && validPassword) {
        var data = {
            "username": username,
            "password": password,
            "admin": 0
        }

        $.ajax({
            type: "POST",
            url: '/createAccount',
            data: data,
            success: accountCreated
        })
    }
}

function accountCreated(result) {
    if (result == "Success")
        window.location.href = "/sign-in";
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + result + "</p>");
        $("#myModal").modal('show');
    }
}

function changeUsernameForm() {
    var usernameChange = $("#usernameChange");
    usernameChangeForm = '<form><div class="form-group"><label for="username">Username:</label><input type="text" class="form-control" id="username" name="username">' +
    '<small id="usernameError" class="error">Username is not available.</small></div>' +
    '<button type="button" onClick="changeUsername()" class="btn btn-primary">Change Username</button></form>';

    usernameChange.html(usernameChangeForm);
}

function changeUsername() {
    var username = $("#username").val();

    var validUsername = availableUsername(username);

    if (validUsername) {
        var data = {
            "username": username
        }

        $.ajax({
            type: "POST",
            url: '/changeUsername',
            data: data,
            success: changedUsername
        })
    }
}

function changedUsername(result) {
    if (result == "Success")
        $("#usernameChange").text("Username changed.");
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + result + "</p>");
        $("#myModal").modal('show');
    }
}

function changePasswordForm() {
    var pwdChange = $("#pwdChange");
    var pwdChangeForm = '<form><div class="form-group"><label for="pwd">Password:</label><input type="password" class="form-control" id="pwd" name="pwd"></div>' +
        '<div class="form-group"><label for="cpwd">Confirm Password:</label><input type="password" class="form-control" id="cpwd" name="cpwd">' +
        '<small id="passwordError" class="error">Passwords don\'t match.</small></div>' +
        '<button type="button" onClick="changePassword()" class="btn btn-primary">Change Password</button></form>';
    
    pwdChange.html(pwdChangeForm);
}

function changePassword() {
    var pwd = $("#pwd").val();
    var cpwd = $("#cpwd").val();
    validPassword = doPasswordsMatch(pwd, cpwd);

    if (validPassword) {
        var data = {
            "password": pwd
        }

        $.ajax({
            type: "POST",
            url: '/changePassword',
            data: data,
            success: changedPassword
        })
    }
}

function changedPassword(result) {
    if (result == "Success")
        $("#pwdChange").text("Password changed.")
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + result + "</p>");
        $("#myModal").modal('show');
    }
}

function op() {
    $.ajax({
        type: "POST",
        url: '/toggleAdmin',
        success: toggledAdmin
    })
}

function toggledAdmin(result) {
    if (result == "Success")
        $("#op").prop("checked", !$("#op").prop("checked"));
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>" + result + "</p>");
        $("#myModal").modal('show');
    }
}

function availableUsername(username) {
    validUsername = true;
    if (!isAvailableUsername(username)) {
        validUsername = false;
        $("#usernameError").show();
    }
    else
        $("#usernameError").hide();

    return validUsername;
}

function isAvailableUsername(username) {
    var data = {
        "username": username
    }

    $.ajax({
        type: "GET",
        url: '/availableUsername',
        data: data,
        success: availableUsernameResult
    })
}

function availableUsernameResult(result) {
    if (result == "Success") {
        console.log("Username is available");
        return true;
    }
    else {
        console.log("Username is not available");
        return false;
    }
}

function doPasswordsMatch(pwd, cpwd) {
    validInput = true;
    if (pwd != cpwd) {
        validInput = false;
        $("#passwordError").show();
    }
    else
        $("#passwordError").hide();

    return validInput;
}