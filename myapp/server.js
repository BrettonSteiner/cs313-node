const express = require('express');
const controller = require('./controller.js');
const bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 8080)
   .use(express.static(__dirname + '/public'))
   // Parse incoming requests data
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
   .get('/', (req, res) => {
       res.render("home");
   })
   .get('/database', (req, res) => {
       res.render("database");
   })
   .get('/profile', (req, res) => {
       res.render("profile");
   })
   .get('/sign-in', (req, res) => {
       res.render("sign-in");
   })
   .get('/sign-up', (req, res) => {
       res.render("sign-up");
   })
   .post('/login', controller.login)
   .post('/createAccount', controller.createAccount)
   .get('/getMajorInfo', controller.getMajorInfo)
   .get('/getITeamInfo', controller.getITeamInfo)
   .listen(app.get('port'), function(){
       console.log('Listening on port: ' + app.get('port'));
   });

