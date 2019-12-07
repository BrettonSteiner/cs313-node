module.exports = {createAccount: createAccount, login: login, loginGuest: loginGuest, logout: logout,
    changePassword: changePassword, availableUsername: availableUsername, changeUsername: changeUsername,
    getMajorColor: getMajorColor, getITeamNumber: getITeamNumber, getMentorInfo: getMentorInfo,
    getMajors: getMajors, getMajor: getMajor, updateMajor: updateMajor, deleteMajor: deleteMajor, createMajor: createMajor,
    getComplexes: getComplexes, getComplex: getComplex, updateComplex: updateComplex, deleteComplex: deleteComplex, createComplex: createComplex,
    getApartments: getApartments, getApartment: getApartment, updateApartment: updateApartment, deleteApartment: deleteApartment, createApartment: createApartment};

require('dotenv').config({path: __dirname + '/../variables.env'});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //This will need to be deactivated for Heroku at some point... Meant to only be used locally

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString})
const bcrypt = require('bcrypt');

function createAccount(req, res) {
    var username = req.body.username;
    var hash = bcrypt.hashSync(req.body.password, 10);
    var sql = 'INSERT INTO Users (username, password) VALUES($1, $2)';
    var values = [ username, hash ];

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
    var sql = 'SELECT id, username, password FROM Users WHERE username = $1';
    var values = [req.body.username];
    var success = false;

    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: " + err);
            res.end("Error: " + err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows[0]);
        if (result.rows[0]) {
            bcrypt.compare(req.body.password, result.rows[0].password, (err, result)=>{
                if (err) {
                    console.log("An error occured... \n" + err);
                }
                
                if (result == true) {
                    console.log("Login successful!");
                    success = true;
                    req.session.username = req.body.username;
                }
                res.json({ success: success });
            });
        }
        else {
            res.json({ success: success });
        }
    });
}

function loginGuest(req, res) {
    if (req.session.username != "Guest") {
        req.session.username = "Guest";
    }
    res.render("home");
}

function logout(req, res) {
    if (req.session.username != null) {
        console.log(req.session.username + " logged out.");
        req.session.destroy();
        res.render("sign-in");
    }
    else {
        res.render("sign-in");
    }
}

function changePassword(req, res) {
    if (req.session.username != undefined) {
        var hash = bcrypt.hashSync(req.body.password, 10);
        var sql = 'UPDATE Users SET password = $2 WHERE username = $1';
        var values = [ req.session.username, hash ];

        pool.query(sql, values, function(err, result) {
            // If an error occurred...
            if (err) {
                console.log("Error in query: " + err);
                res.end("Error: " + err);
            }
        
            // Log this to the console for debugging purposes.
            console.log("Back from DB with result:");
            console.log(result);
            res.json({success: true});
        });
    }
    else
        res.json({success: false});
}

function availableUsername(req, res) {
    if (req.query.username == "Guest") {
        res.end("Username is not available");
    }
    else {
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
            if (result.rows[0] != undefined)
                res.end("Username is not available");
            else
                res.end("Success");
        });
    }
}

function changeUsername(req, res) {
    var username = req.body.username;
    var sql = "UPDATE Users SET username = $2 WHERE username = $1";
    var values = [ req.session.username, username ];

    pool.query(sql, values, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: " + err);
            res.end("Error: " + err);
        }
    
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result);
        req.session.username = username;
        res.json({success: true});
    });
}

function getMajorColor(req, res) {
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

function getITeamNumber(req, res) {
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

function getMentorInfo(req, res) {
    var sql = 'SELECT Mentors.name, Mentors.phone FROM Mentors JOIN ITeams ON ITeams.id = Mentors.iteamid WHERE ITeams.number = $1';
    var values = [req.query.iteamNumber];
    
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
            res.end("Unknown I-Team number");
    });
}

function getMajors(req, res) {
    var sql = 'SELECT id, name, collegeId FROM Majors ORDER BY id';
    
    pool.query(sql, function(err, result) {
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

function deleteMajor(req, res) {
    var sql = 'DELETE FROM Majors WHERE id = $1';
    var values = [ req.body.id ];

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

function createMajor(req, res) {
    const { name, collegeid } = req.body;
    var sql = 'INSERT INTO Majors (name, collegeid) VALUES ($1, $2)';
    var values = [ name, collegeid ];

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
    var sql = 'SELECT id, name FROM Complexes ORDER BY id';

    pool.query(sql, function(err, result) {
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

function deleteComplex(req, res) {
    var sql = 'DELETE FROM Complexes WHERE id = $1';
    var values = [ req.body.id ];

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

function createComplex(req, res) {
    const name = req.body.name;
    var sql = 'INSERT INTO Complexes (name) VALUES ($1)';
    var values = [ name ];

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
    var sql = 'SELECT id, number, complexid, iteamid FROM Apartments ORDER BY id';
    
    pool.query(sql, function(err, result) {
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

function deleteApartment(req, res) {
    var sql = 'DELETE FROM Apartments WHERE id = $1';
    var values = [ req.body.id ];

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

function createApartment(req, res) {
    const { number, complexid, iteamid } = req.body;
    var sql = 'INSERT INTO Apartments (number, complexid, iteamid) VALUES ($1, $2, $3)';
    var values = [ number, complexid, iteamid ];

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