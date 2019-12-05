require('dotenv').config({path: __dirname + '/../../variables.env'});
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL; 
const pool = new Pool({connectionString: connectionString});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const bcrypt = require('bcrypt');

var app = express();

app.set('port', process.env.PORT || 8080)
   .use(express.static(__dirname + '/public'))
   .use(express.json())
   .use(express.urlencoded({ extended: true }))
   .use(session({
      name: 'server-session-cookie-id',
      secret: 'my express secret',
      saveUninitialized: true,
      resave: true,
      store: new FileStore()
    }))
   .use(logRequest)
   .get('/', (req, res) => {
      res.sendFile('test.html', { root: __dirname + '/public'});
   })
   .post('/login', (req, res) => {
      const { username, password } = req.body;
      console.log("Username: " + username + "\nPassword: " + password);
      var success = false;
      
      var sql = "SELECT * FROM Team12Users WHERE username = $1::varchar";
      var params = [username];
      pool.query(sql, params, (err, result) => {
         if (err) {
            console.log("Error in query: ");
            console.log(err);
         }

         console.log("Back from DB with result: ");
         console.log(result.rows);
         if (result.rows[0]) {
            bcrypt.compare(password, result.rows[0].password, (err, result)=>{
               if (err) {
                  console.log("An error occured... \n" + err);
               }
   
               if (result == true) {
                  success = true;
               }
               req.session.username = username;
               var json = {success: success};
               res.json(json);
            });
         }
         else {
            res.json({ success: false });
         }
      });
   })
   .post('/logout', (req, res) => {
      var success = false;

      if (req.session.username != null) {
         req.session.destroy();
         success = true;
      }

      var json = { success: success };
      res.json(json);
   })
   .get('/getServerTime', verifyLogin)
   .get('/getServerTime', (req, res) => {
      var success = true;
      var time = new Date();
      var json = { success: success, time: time };
      res.json(json);
   })
   .listen(app.get('port'), function(){
    console.log('Listening on port: ' + app.get('port'));
   });

function logRequest (req, res, next) {
   console.log("Received a request for: " + req.url);
   next();
}

function verifyLogin (req, res, next) {
   if (req.session.username != null) {
      next();
   }
   else {
      var json = {success: false, message: "Access Denied"};
      res.status(401).json(json);
   }
}