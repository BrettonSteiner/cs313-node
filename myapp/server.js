const express = require('express');
const controller = require('./controller.js');

var app = express();

app.set('port', process.env.PORT || 8080)
   .use(express.static(__dirname + '/public'))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
   .get('/', (req, res) => {
       res.render("home");
   })
   .get('/database', (req, res) => {
       res.sendFile('comingSoon.html', { root: __dirname + '/public'});
   })
   .get('/profile', (req, res) => {
       res.sendFile('comingSoon.html', { root: __dirname + '/public'});
   })
   .get('/getInfo', controller.getInfo)
   .listen(app.get('port'), function(){
       console.log('Listening on port: ' + app.get('port'));
   });

