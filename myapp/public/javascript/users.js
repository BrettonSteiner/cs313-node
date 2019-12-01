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

    var validInput = true;
    /* Should check if the username is available in the future
    if (!isUsernameAvailable(username)) {
        validInput = false;
        $("#usernameError").show();
    }
    else
        $("#usernameError").hide();
    */

    if (password != cpassword) {
        validInput = false;
        $("#passwordError").show();
    }
    else
        $("#passwordError").hide();

    if (validInput) {
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
        $("#modalBody").text(result);
        $("#myModal").modal('show');
    }
}