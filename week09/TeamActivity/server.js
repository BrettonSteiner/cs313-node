var port = process.env.PORT || 8080;
var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(__dirname+'/public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname+'/public/home.html'));
})

app.get("/math", function(req, res) {
	// Controller
    console.log("Received a request for the math page");
    var operator = req.query.operator;
    // console.log(operator);
    var operand1 = req.query.operand1;
    var operand2 = req.query.operand2;

    var result = calculate(operator, operand1, operand2);
    var object = {result:result};

    res.render("math", object);
    console.log(object);
});

app.listen(port, function() {
	console.log("The server is up and listening on port " + port);
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