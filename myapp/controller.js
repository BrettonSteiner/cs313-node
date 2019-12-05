module.exports = {createAccount: createAccount, login: login, changePassword: changePassword, 
    availableUsername: availableUsername, changeUsername: changeUsername, toggleAdmin: toggleAdmin, 
    getMajorInfo: getMajorInfo, getITeamInfo: getITeamInfo,
    getMajors: getMajors, getMajor: getMajor, updateMajor: updateMajor,
    getComplexes: getComplexes, getComplex: getComplex, updateComplex: updateComplex,
    getApartments: getApartments, getApartment: getApartment, updateApartment: updateApartment};

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

function changePassword(req, res) {
    var password = req.body.password;
    console.log("New password: ", password);

    res.end("Success");
}

function availableUsername(req, res) {
    var sql = 'SELECT id FROM Users WHERE username = $1';
    var values = [req.query.username];
    
    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: " + err);
            res.end("Error: " + err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        if (result.rows[0])
            res.end("Username is not available");
        else
            res.end("Success");
    });
}

function changeUsername(req, res) {
    var username = req.body.username;
    console.log("New username: ", username);

    res.end("Success");
}

function toggleAdmin(req, res) {
    console.log("Toggled admin status");

    res.end("Success");
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

function getMajors(req, res) {
    const { id, name, college } = req.query;
    var sql = 'SELECT id, name, collegeId FROM Majors';
    var values = [];

    if (id != '' || name != '' || college != '') {
        sql += ' WHERE';

        if (id != '')
            sql += ' id = $' + values.push(id);
        if (name != '') {
            if (values.length > 0)
                sql += ' AND';
            sql += ' name = $' + values.push(name);
        }
        if (college != '') {
            if (values.length > 0)
                sql += ' AND';
            sql += ' collegeid = $' + values.push(college);
        }
    }
    sql += ' ORDER BY id';
    console.log(sql, values);
    
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
            res.json(result.rows);
        else
            res.end("Fail");
    });
}

function getMajor(req, res) {
    var sql = 'SELECT id, name, collegeid FROM Majors WHERE id = $1';
    var values = [ req.query.id ];

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
            res.json(result.rows[0]);
        else
            res.end("Fail");
    });
}

function updateMajor(req, res) {
    const { id, name, collegeid } = req.body;
    var sql = 'UPDATE Majors SET name = $2, collegeid = $3 WHERE id = $1';
    var values = [ id, name, collegeid ];

    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        if (result.rows != undefined)
            res.json("Success");
        else
            res.end("Fail");
    });
}

function getComplexes(req, res) {
    const { id, name } = req.query;
    var sql = 'SELECT id, name FROM Complexes';
    var values = [];

    if (id != '' || name != '') {
        sql += ' WHERE';

        if (id != '')
            sql += ' id = $' + values.push(id);
        if (name != '') {
            if (values.length > 0)
                sql += ' AND';
            sql += ' name = $' + values.push(name);
        }
    }
    sql += ' ORDER BY id';
    console.log(sql, values);
    
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
            res.json(result.rows);
        else
            res.end("Fail");
    });
}

function getComplex(req, res) {
    var sql = 'SELECT id, name FROM Complexes WHERE id = $1';
    var values = [ req.query.id ];

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
            res.json(result.rows[0]);
        else
            res.end("Fail");
    });
}

function updateComplex(req, res) {
    const { id, name } = req.body;
    var sql = 'UPDATE Complexes SET name = $2 WHERE id = $1';
    var values = [ id, name ];

    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        if (result.rows != undefined)
            res.json("Success");
        else
            res.end("Fail");
    });
}

function getApartments(req, res) {
    const { id, number, complex, iteam } = req.query;
    var sql = 'SELECT id, number, complexid, iteamid FROM Apartments';
    var values = [];

    if (id != '' || number != '' || complex != '' || iteam != '') {
        sql += ' WHERE';

        if (id != '')
            sql += ' id = $' + values.push(id);
        if (number != '') {
            if (values.length > 0)
                sql += ' AND';
            sql += ' number = $' + values.push(number);
        }
        if (complex != '') {
            if (values.length > 0)
                sql += ' AND';
            sql += ' complexid = $' + values.push(complex);
        }
        if (iteam != '') {
            if (values.length > 0)
                sql += ' AND';
            sql += ' iteamid = $' + values.push(iteam);
        }
    }
    sql += ' ORDER BY id';
    console.log(sql, values);
    
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
            res.json(result.rows);
        else
            res.end("Fail");
    });
}

function getApartment(req, res) {
    var sql = 'SELECT id, number, complexid, iteamid FROM Apartments WHERE id = $1';
    var values = [ req.query.id ];

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
            res.json(result.rows[0]);
        else
            res.end("Fail");
    });
}

function updateApartment(req, res) {
    const { id, number, complexid, iteamid } = req.body;
    var sql = 'UPDATE Apartments SET number = $2, complexid = $3, iteamid = $4 WHERE id = $1';
    var values = [ id, number, complexid, iteamid ];

    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        if (result.rows != undefined)
            res.json("Success");
        else
            res.end("Fail");
    });
}