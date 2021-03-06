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
        $("#currentUsername").text(result.username);
    }
}

function signIn() {
    var username = $("#username").val();
    var password = $("#pwd").val();

    var data = {
        "username": username,
        "password": password
    }

    $.ajax({
        type: "POST",
        url: '/login',
        data: data,
        success: logIn
    })
}

function logIn(result) {
    if (result.success)
        window.location.href = "/";
    else
        $("#loginError").show();
}

function signUp() {
    var username = $("#username").val();
    var data = {
        "username": username
    }

    $.ajax({
        type: "GET",
        url: '/availableUsername',
        data: data,
        success: signUpUsernameResult
    });
}

function signUpUsernameResult(results) {
    if (results == "Success") {
        $("#usernameError").hide();

        var username = $("#username").val();
        var password = $("#pwd").val();
        var cpassword = $("#cpwd").val();

        var validPassword = doPasswordsMatch(password, cpassword);

        if (validPassword) {
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
    else {
        $("#usernameError").show();
        doPasswordsMatch(password, cpassword);
    } 
}

function accountCreated(result) {
    if (result == "Success")
        window.location.href = "/sign-in";
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>Account failed to be created.</p>");
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

    var data = {
        "username": username
    }

    $.ajax({
        type: "GET",
        url: '/availableUsername',
        data: data,
        success: changeUsernameResult
    });
}

function changeUsernameResult(results) {
    if (results == "Success") {
        $("#usernameError").hide();

        var username = $("#username").val();

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
    else {
        $("#usernameError").show();
    }
}

function changedUsername(result) {
    if (result.success) {
        var html = 'Username changed.<br><button class="btn btn-secondary" type="button" onclick="changeUsernameForm()">Change Username</button>';
        $("#usernameChange").html(html);
        userInfo();
    }
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>Username failed to be changed.</p>");
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
    if (result.success)
        $("#pwdChange").html('Password changed.<br><button class="btn btn-secondary" type="button" onclick="changePasswordForm()">Change Password</button>')
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>Password failed to be changed.</p>");
        $("#myModal").modal('show');
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

function deleteAccountForm() {
    var dltAccount = $("#dltAccount");
    var dltAccountForm = '<form><div class="form-group"><label for="pwd">Confirm with Password:</label><input type="password" class="form-control" id="pwd" name="pwd">' +
        '<small id="deleteError" class="error">Incorrect password.</small></div>' +
        '<button type="button" onClick="deleteAccount()" class="btn btn-danger">Delete Account</button></form>';
    
        dltAccount.html(dltAccountForm);
}

function deleteAccount() {
    var pwd = $("#pwd").val();

    if (pwd != undefined && pwd != "") {
        $("#deleteError").hide();
        var data = {
            "password": pwd
        }

        $.ajax({
            type: "POST",
            url: '/verifyPassword',
            data: data,
            success: passwordVerified
        })
    }
    else {
        $("#deleteError").show();
    }
}

function passwordVerified(results) {
    if (results != undefined && results.success == true && results.id != undefined) {
        $("#deleteError").hide();

        var data = {
            "id": results.id
        }

        $.ajax({
            type: "POST",
            url: '/deleteAccount',
            data: data,
            success: accountDeleted
        })
    }
    else {
        $("#deleteError").show();
    }
}

function accountDeleted(results) {
    console.log(results);
    if (results != undefined && results.success == true) {
        window.location.href = "/logout";
    }
    else {
        $("#modalTitle").text("Server Error:");
        $("#modalBody").html("<p>Account failed to be deleted.</p>");
        $("#myModal").modal('show');
    }
}