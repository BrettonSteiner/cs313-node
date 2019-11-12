var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get("/math", function(req, res) {
	// Controller
    console.log("Received a request for the home page");
    var operator = req.query.operator;
    // console.log(operator);
    var operand1 = req.query.operand1;
    var operand2 = req.query.operand2;

    var result = calculate(operator, operand1, operand2);
    var object = {result:result};

	// var name = getCurrentLoggedInUserAccount();
	// var emailAddress = "john@email.com";

	// var params = {username: name, email: emailAddress};
    // res.write("This is the root.");
	// res.end();
    res.render("math", object);
    console.log(object);
});

app.listen(8080, function() {
	console.log("The server is up and listening on port 5000");
});


function calculate (operator, operand1, operand2){
switch(operator){
    case '0':
        return (operand1 - 0) + (operand2 - 0);
    break;

    case '1':
        return operand1 - operand2;
    break;

    case '2':
        return operand1 * operand2;
    break;

    case '3':
        return operand1 / operand2;
    break;
}
}