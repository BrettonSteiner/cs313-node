const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const controller = require('./controller.js');
var app = express();

app.set('port', process.env.PORT || 8080)
   .use(express.static(__dirname + '/public'))
   .use(express.json())
   .use(express.urlencoded({ extended: false }))
   .use(session({
       name: 'server-session-cookie-id',
       secret: 'my express secret',
       saveUninitialized: true,
       resave: true,
       store: new FileStore()
   }))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
   .get('/', (req, res) => {
       res.render("home");
   })
   .get('/database', verifyLogin, (req, res) => {
       res.render("database");
   })
   .get('/profile', verifyLogin, (req, res) => {
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
   .get('/logout', controller.logout)
   .post('/changePassword', verifyLogin, controller.changePassword)
   .get('/availableUsername', controller.availableUsername)
   .post('/changeUsername', verifyLogin, controller.changeUsername)
   .get('/getMajorColor', controller.getMajorColor)
   .get('/getITeamNumber', controller.getITeamNumber)
   .get('/getMentorInfo', controller.getMentorInfo)
   .get('/getMajors', verifyLogin, controller.getMajors)
   .get('/getMajorNames', controller.getMajorNames)
   .get('/getMajor', verifyLogin, controller.getMajor)
   .post('/updateMajor', verifyLogin, controller.updateMajor)
   .post('/deleteMajor', verifyLogin, controller.deleteMajor)
   .put('/createMajor', verifyLogin, controller.createMajor)
   .get('/getComplexes', verifyLogin, controller.getComplexes)
   .get('/getComplexNames', controller.getComplexNames)
   .get('/getComplex', verifyLogin, controller.getComplex)
   .post('/updateComplex', verifyLogin, controller.updateComplex)
   .post('/deleteComplex', verifyLogin, controller.deleteComplex)
   .put('/createComplex', verifyLogin, controller.createComplex)
   .get('/getApartments', verifyLogin, controller.getApartments)
   .get('/getApartmentNumbers', controller.getApartmentNumbers)
   .get('/getApartment', verifyLogin, controller.getApartment)
   .post('/updateApartment', verifyLogin, controller.updateApartment)
   .post('/deleteApartment', verifyLogin, controller.deleteApartment)
   .put('/createApartment', verifyLogin, controller.createApartment)
   .get('/getColleges', verifyLogin, controller.getColleges)
   .get('/getITeams', verifyLogin, controller.getITeams)
   .get('/isLoggedIn', controller.isLoggedIn)
   .listen(app.get('port'), function(){
       console.log('Listening on port: ' + app.get('port'));
   });

function verifyLogin (req, res, next) {
    if (req.session.username != undefined)
        next();
    else if (req.url == "/" || req.url == "/database" || req.url == "/profile")
        res.render("sign-in");
    else {
        var json = {success: false, message: "Access Denied"};
        res.status(401).json(json);
    }
}