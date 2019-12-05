const express = require('express');
const controller = require('./controller.js');
var app = express();

app.set('port', process.env.PORT || 8080)
   .use(express.static(__dirname + '/public'))
   .use(express.json())
   .use(express.urlencoded({ extended: false }))
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
   .post('/createAccount', controller.createAccount)
   .post('/login', controller.login)
   .post('/changePassword', controller.changePassword)
   .get('/availableUsername', controller.availableUsername)
   .post('/changeUsername', controller.changeUsername)
   .post('/toggleAdmin', controller.toggleAdmin)
   .get('/getMajorInfo', controller.getMajorInfo)
   .get('/getITeamInfo', controller.getITeamInfo)
   .get('/getMajors', controller.getMajors)
   .get('/getMajor', controller.getMajor)
   .post('/updateMajor', controller.updateMajor)
   .get('/getComplexes', controller.getComplexes)
   .get('/getComplex', controller.getComplex)
   .post('/updateComplex', controller.updateComplex)
   .get('/getApartments', controller.getApartments)
   .get('/getApartment', controller.getApartment)
   .post('/updateApartment', controller.updateApartment)
   .listen(app.get('port'), function(){
       console.log('Listening on port: ' + app.get('port'));
   });

