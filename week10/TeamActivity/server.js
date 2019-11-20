process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require('express');
const { Pool } = require('pg');
const result = require('dotenv').config({path: __dirname + '/../../variables.env'});
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString})

var app = express();

app.set('port', process.env.PORT || 5000)
   .use(express.static(__dirname + '/public'))
   .get('/', function(req, res){
       res.sendFile('home.html', { root: __dirname + '/public'});
   })
   .get('/getPerson', (req, res)=> {
       var getPersonQuery = 'SELECT * FROM People WHERE id = $1';
       var getPersonValues = [req.query.id];
       pool.query(getPersonQuery, getPersonValues, function(err, result) {
           // If an error occurred...
           if (err) {
               console.log("Error in query: ")
               console.log(err);
           }
       
           // Log this to the console for debugging purposes.
           console.log("Back from DB with result:");
           console.log(result.rows);
           res.json(result.rows);
       });
   })
   .listen(app.get('port'), function(){
       console.log('Listening on port: ' + app.get('port'));
   });