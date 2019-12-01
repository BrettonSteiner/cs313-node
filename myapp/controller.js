module.exports = {createAccount: createAccount, login: login, getMajorInfo: getMajorInfo, getITeamInfo: getITeamInfo};

require('dotenv').config({path: __dirname + '/../variables.env'});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //This will need to be deactivated for Heroku at some point... Meant to only be used locally

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString})

function createAccount(req, res) {
    var sql = 'INSERT INTO Users (username, password, admin) VALUES($1, $2, $3)';
    var values = [req.body.username, req.body.password, req.body.admin];

    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: " + err);
            res.end("Error: " + err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result);
        res.end("Success");
    });
}

function login(req, res) {
    var sql = 'SELECT id FROM Users WHERE username = $1 and password = $2';
    var values = [req.body.username, req.body.password];
    
    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: " + err);
            res.end("Error: " + err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows[0]);
        if (result.rows[0] != undefined)
            res.end("Success");
        else
            res.end("Username or Password incorrect.");
    });
}

function getMajorInfo(req, res) {
    var sql = 'SELECT color FROM Colleges JOIN Majors ON Majors.collegeId = Colleges.id WHERE Majors.name = $1';
    var values = [req.query.majorName];
    
    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        if (result.rows[0] != undefined)
            res.end(result.rows[0].color);
        else
            res.end("Unknown major");
    });
}

function getITeamInfo(req, res) {
    var sql = 'SELECT ITeams.number FROM ITeams JOIN Apartments ON Apartments.iTeamId = ITeams.id JOIN Complexes ON Complexes.id = Apartments.complexId WHERE Complexes.name = $1 AND Apartments.number = $2';
    var values = [req.query.complex, req.query.apartment];
    
    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        if (result.rows[0] != undefined)
            res.end(result.rows[0].number.toString());
        else
            res.end("Unknown complex or apartment");
    });
}