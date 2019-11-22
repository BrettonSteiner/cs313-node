module.exports = {getInfo: getInfo};

require('dotenv').config({path: __dirname + '/../../variables.env'});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //This will need to be deactivated for Heroku at some point... Meant to only be used locally

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString})

function getMajorInfo(req, res) {
    var getPersonQuery = 'SELECT color FROM Colleges JOIN Majors ON Majors.collegeId = Colleges.id WHERE Majors.name = $1';
    var getPersonValues = [req.query.majorName];
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
}

function getInfo(req, res) {
    var getColorQuery = 'SELECT color FROM Colleges JOIN Majors ON Majors.collegeId = Colleges.id WHERE Majors.name = $1';
    var getColorValues = [req.query.majorName];
    
    pool.query(getColorQuery, getColorValues, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        res.json(result.rows[0]);
    });
}