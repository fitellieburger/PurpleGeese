/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*
    SETUP 
*/

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 57913;                 // Set a port number at the top so it's easy to change in the future
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'));

// Database
var db = require('./database/db-connector')

// Handlebars
var exphbs       = require('express-handlebars');
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');

/*
   INDEX ROUTES
*/

app.get('/', function(req, res){
    return res.render('index');
})


/*
  SEASONS ROUTES
*/
// GET
app.get('/seasons', function(req, res){
    let query1;
    if(req.query.divisionID === undefined){
        query1 = "SELECT  Seasons.seasonID AS '_', Seasons.description AS 'Season', CAST(startDate AS varchar(10)) AS 'StartDate',\
        CAST(endDate AS varchar(10)) AS 'EndDate', seasonFee AS 'Fee' FROM Seasons\
       LEFT JOIN SeasonsDivisions on Seasons.seasonID = SeasonsDivisions.seasonID\
       LEFT JOIN Divisions on SeasonsDivisions.divisionID = Divisions.divisionID\
        ORDER BY endDate DESC\
        ;";
}
    else{
        query1 = `SELECT  Seasons.seasonID AS '_', Seasons.description AS 'Season', CAST(startDate AS varchar(10)) AS 'StartDate',\
         CAST(endDate AS varchar(10)) AS 'EndDate', seasonFee AS 'Fee' FROM Seasons\
        INNER JOIN SeasonsDivisions on Seasons.seasonID = SeasonsDivisions.seasonID\
        INNER JOIN Divisions on SeasonsDivisions.divisionID = Divisions.divisionID\
        WHERE Divisions.divisionID LIKE '%${req.query.divisionID}%' \
        ORDER BY endDate DESC \
        ;` 
    }

        let query2 = "SELECT seasonID, description \
                    FROM Seasons \
                    ORDER BY endDate DESC;";

        let query3 = "SELECT * FROM Divisions ORDER BY maxAge;";

        db.pool.query(query1, function(error, rows, fields){
            let data = rows;

            db.pool.query(query2, (error, rows, fields)=>{
                let seasons = rows;
                
                db.pool.query(query3, (error, rows, fields)=>{
                    let divisions = rows;

                    return res.render('seasons', {data: data, 
                        seasons: seasons, divisions: divisions});
                })
            })
        })
    });     

// POST
app.post('/addSeason', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    //parse int and array
    let seasonFee = parseInt(data.fee);
    let divArray  = JSON.parse(data.selectedDivisions);

    console.log(data.divisions);
    console.log(divArray);

    if (isNaN(seasonFee))
    {
        seasonFee = 'NULL'
    }

    // Create the query and run it on the database
    let query1 = `INSERT INTO Seasons (description, startDate, endDate, seasonFee)\
     VALUES ('${data.description}', '${data.startDate}', '${data.endDate}', ${seasonFee})\
     ;`;

    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT _ FROM Teams above and
        // presents it on the screen
        else
        {
            
                    
            res.send(rows);
                    

        }
            })
                
                        
    })            
        

// DELETE
app.delete("/deleteSeason", function(req,res,next){
    let data = req.body;
    let seasonID = parseInt(data.seasonID);
    let query1 = `DELETE FROM Seasons WHERE seasonID = '${seasonID}'`;

    // Run the 1st query
    db.pool.query(query1, [seasonID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  })});

/*
    DIVISIONS ROUTES 
*/

// GET 
app.get("/divisions", function(req, res) {
    let query1 = `SELECT * FROM Divisions
    ORDER BY maxAge DESC;`;

    db.pool.query(query1, function(error, rows, fields) {
        let divisions = rows;
        return res.render('divisions', {data: divisions})
    })
})

// POST
app.post("/addDivision", function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body
    
    // Capture NULL values
    let description = data.description;
    if (description === '') {
        description = 'NULL'
    }

    let minAge = parseInt(data.minAge);
    if (isNaN(minAge)) {
        minAge = 0
    }

    let maxAge = parseInt(data.maxAge);
    if (isNaN(maxAge)) {
        maxAge = 0
    }

    let gender = data.gender;
    if (gender === '') {
        gender = '?'
    }

    let minPlayers = parseInt(data.minPlayers);
    if (isNaN(minPlayers)) {
        minPlayers = 'NULL'
    }

    let maxPlayers = parseInt(data.maxPlayers);
    if (isNaN(maxPlayers)) {
        maxPlayers = 'NULL'
    }

    let ballSize = parseInt(data.ballSize);
    if (isNaN(ballSize)) {
        ballSize = 'NULL'
    }

    let netSize = data.netSize;
    if (netSize === '') {
        netSize = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Divisions(description, minAge, maxAge, gender, minPlayers, maxPlayers, ballSize, netSize)
    VALUES ('${description}', '${minAge}', '${maxAge}', '${gender}', 
    '${minPlayers}', '${maxPlayers}', '${ballSize}', '${netSize}');`

    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a query2
            query2 = `SELECT * FROM Divisions;`

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error){
                    // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else{
                    res.send(rows);
                }
            })
        }
    })
});


// PUT
app.put("/updateDivision", function(req,res,next){
    let data = req.body;
    let divisionID = parseInt(data.divisionID);
    let description = data.description;
    let minAge = parseInt(data.minAge);
    let maxAge = parseInt(data.maxAge);
    let gender = data.gender;
    let minPlayers = parseInt(data.minPlayers);
    let maxPlayers = parseInt(data.maxPlayers);
    let ballSize = parseInt(data.ballSize);
    let netSize = data.netSize;

    // Capture NULL values
    if (description === '') {
        description = 'n/a'
    }

    if (isNaN(minAge)) {
        minAge = 0
    }

    if (isNaN(maxAge)) {
        maxAge = 0
    }

    if (gender === '') {
        gender = 'M'
    } 

    if (isNaN(minPlayers)) {
        minPlayers = 'NULL'
    }

    if (isNaN(maxPlayers)) {
        maxPlayers = 'NULL'
    }

    if (isNaN(ballSize)) {
    ballSize = 'NULL'
    }

if (netSize === '') {
    netSize = 'n/a'
}

let query1 = `UPDATE Divisions \
SET divisionID = '${divisionID}', \
    description = '${description}', \
    minAge = '${minAge}', \
    maxAge = '${maxAge}', \
    gender = '${gender}', \
    minPlayers = '${minPlayers}', \
    maxPlayers = '${maxPlayers}', \
    ballSize = '${ballSize}', \
    netSize = '${netSize}' \
WHERE Divisions.divisionID = '${divisionID}';`;

let query2 = `SELECT * FROM Divisions WHERE divisionID = '${divisionID}';`;

// Run the 1st query
db.pool.query(query1, function(error, rows, fields){
    if (error){
    // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(data)
        console.log(error);
    
    res.sendStatus(400);
    }

    else{
        // Run the second query
        db.pool.query(query2, function(error, rows, fields) {
        
            if (error){
                console.log(error);
                res.sendStatus(400);
            } 
            
            else{
                res.send(rows);
            }
        })
    }
})
});

// DELETE
app.delete("/deleteDivision", function(req,res,next){
    let data = req.body;
    let divisionID = parseInt(data.divisionID);
    let query1 = `DELETE FROM Divisions WHERE divisionID = ${divisionID}`;

    // Run the 1st query
    db.pool.query(query1, [divisionID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else{
            res.sendStatus(204);
        }
  })
});


  /*
  SEASONSDIVISIONS ROUTES
*/
// GET
app.get('/seasonsdivisions', function(req, res){
    let query1;
    if(req.query.divisionID === undefined){
        query1 = "SELECT SeasonsDivisions.seasonDivisionID AS'_', Seasons.description AS 'Season',\
         Divisions.description AS 'Division', \
        CAST(startDate AS varchar(10)) AS 'StartDate',\
        CAST(endDate AS varchar(10)) AS 'EndDate'\
        FROM SeasonsDivisions\
        LEFT JOIN Seasons ON Seasons.seasonID = SeasonsDivisions.seasonID\
        LEFT JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID\
        ORDER BY Seasons.endDate, Divisions.maxAge\
        ;";
}
    else{
        query1 = `"SELECT SeasonsDivisions.seasonDivisionID AS'_', Seasons.description AS 'Season',\
        Divisions.description AS 'Division', \
       CAST(startDate AS varchar(10)) AS 'StartDate',\
       CAST(endDate AS varchar(10)) AS 'EndDate'\
       FROM SeasonsDivisions\
       INNER JOIN Seasons ON Seasons.seasonID = SeasonsDivisions.seasonID\
       INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID\
        WHERE Divisions.divisionID LIKE '%${req.query.divisionID}%' \
        ORDER BY Seasons.endDate, Divisions.maxAge\
        ;` 
    }

        let query2 = "SELECT seasonID, description \
                    FROM Seasons \
                    ORDER BY endDate DESC;";

        let query3 = "SELECT * FROM Divisions;";

        db.pool.query(query1, function(error, rows, fields){
            let data = rows;

            db.pool.query(query2, (error, rows, fields)=>{
                let seasons = rows;
                
                db.pool.query(query3, (error, rows, fields)=>{
                    let divisions = rows;

                    return res.render('seasonsdivisions', {data: data, 
                        seasons: seasons, divisions: divisions});
                })
            })
        })
    });

// POST
app.post('/add-seasonDivision-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO SeasonsDivisions (description, seasonID, divisionID)
    VALUES (
        CONCAT((SELECT description FROM Divisions WHERE divisionID = ${data['select-division']}), ' ', 
               (SELECT description FROM Seasons WHERE seasonID = ${data['select-season']})
               ), 
        ${data['select-season']},
        ${data['select-division']}
        );`
    ;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT _ FROM Teams above and
        // presents it on the screen
        else
        {
            res.redirect('/seasonsdivisions');
        }
    })  
    })

// DELETE
app.delete("/deleteSeasonDivision", function(req,res,next){
    let data = req.body;
    let seasonDivisionID = parseInt(data.seasonDivisionID);
    let query1 = `DELETE FROM SeasonsDivisions WHERE seasonDivisionID = '${seasonDivisionID}'`;

    // Run the 1st query
    db.pool.query(query1, [seasonDivisionID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  })});


/*
    TEAMS ROUTES
*/

// GET
app.get('/teams', function(req, res){
    let query1;
    if(req.query.name === undefined){
        query1 = "SELECT Teams.teamID, Teams.name, Teams.mascot, \
        Divisions.description as 'teamDivision', concat(Adults.firstName, \
        ' ', Adults.lastName) as 'headCoach', COUNT(Players.playerID) AS numPlayers FROM Teams \
        INNER JOIN Volunteers ON Teams.headCoachID = Volunteers.volunteerID \
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID \
        LEFT JOIN Divisions ON Teams.teamDivisionID = Divisions.divisionID \
        ORDER BY Teams.name;";
}
    else{
        query1 = `SELECT Teams.teamID, Teams.name, Teams.mascot, 
        Divisions.description as 'teamDivision', concat(Adults.firstName, 
        ' ', Adults.lastName) as 'headCoach', COUNT(Players.playerID) AS numPlayers FROM Teams 
        INNER JOIN Volunteers ON Teams.headCoachID = Volunteers.volunteerID 
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID 
        LEFT JOIN Divisions ON Teams.teamDivisionID = Divisions.divisionID 
        WHERE Teams.name LIKE "%${req.query.name}%"
        ORDER BY Teams.name;` 
    }

        let query2 = "SELECT volunteerID, concat(Adults.firstName,' ' ,\
                    Adults.lastName) as 'coach' \
                    FROM Volunteers \
                    INNER JOIN Adults ON Volunteers.adultID = Adults.adultID\
                    WHERE Volunteers.role = 'Coach' \
                    GROUP BY Adults.adultID\
                    ORDER BY Adults.lastName, Adults.firstName;";

        let query3 = "SELECT * FROM Divisions;";

        db.pool.query(query1, function(error, rows, fields){
            let teams = rows;

            db.pool.query(query2, (error, rows, fields)=>{
                let volunteers = rows;
                
                db.pool.query(query3, (error, rows, fields)=>{
                    let divisions = rows;

                    return res.render('teams', {data: teams, 
                        volunteers: volunteers, divisions: divisions});
                })
            })
        })
    });                                        

// POST
app.post('/insertTeamAjax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let teamName = data.name;
    let mascot = data.mascot
    let teamDivisionID = parseInt(data.teamDivisionID);
    if (isNaN(teamDivisionID)){
        teamDivisionID = 'NULL'
    }

    let headCoachID = parseInt(data.headCoachID);
    if (isNaN(headCoachID)){
        headCoachID = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Teams (name, mascot, teamDivisionID, headCoachID) 
    VALUES ('${data.name}', '${data.mascot}', ${teamDivisionID}, ${data.headCoachID})`;

    query2 = `INSERT INTO Volunteers (role, details, adultID) \
    SELECT role, details, adultID FROM Volunteers WHERE volunteerID = ${headCoachID};\
    `
    query3 = `UPDATE Volunteers SET teamID = (SELECT teamID FROM Teams WHERE name = '${teamName}'),\
     details = 'Head Coach' WHERE volunteerID = ${headCoachID};
    `
    
    // run the 1st query
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error){
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else{
            // Run the second query
            db.pool.query(query2, [teamName, headCoachID], function(error, rows, fields) {
            
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } 
                
                else{
                    // Run the third query
                    db.pool.query(query3, [teamName, headCoachID], function(error, rows, fields) {
                    
                        if (error){
                            console.log(error);
                            res.sendStatus(400);
                        } 
                        
                        else{
                            // If there was no error, perform a query2
                            query4 = `SELECT * FROM Teams;`;
                            db.pool.query(query4, function(error, rows, fields){
                
                                // If there was an error on the second query, send a 400
                                if (error){
                                    // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                                    console.log(error);
                                    res.sendStatus(400);
                                }
                                // If all went well, send the results of the query back.
                                else{
                                    res.send(rows);
                                }
                            })
                        }
                    })
                }
            })
        }
        
    })
});

// PUT
app.put('/putTeamAjax', function(req,res,next){
    let data = req.body;
    let mascot = data.mascot;
    let teamName = parseInt(data.teamName);
    let queryUpdateMascot = `UPDATE Teams SET mascot = ? WHERE Teams.teamID = ?`;
    let selectTeam = `SELECT * FROM Teams WHERE teamID = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateMascot, [mascot, teamName], function(error, rows, fields){
        if (error){
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    
        else{
            // Run the second query
            db.pool.query(selectTeam, [mascot], function(error, rows, fields) {
            
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } 
                
                else{
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE
app.delete('/deleteTeamAjax/', function(req,res,next){
    let data = req.body;
    let teamID = parseInt(data.teamID);
    let deleteTeam= `DELETE FROM Teams WHERE teamID = ?`;

    // Run the 1st query
    db.pool.query(deleteTeam, [teamID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  })});

/*
    ADULTS ROUTES 
*/

// GET
app.get("/adults", function(req, res) {
    let query1 = `SELECT * FROM Adults
                    ORDER BY Adults.lastName, Adults.firstName ASC;`;

    db.pool.query(query1, function(error, rows, fields) {
        let adults = rows;
        return res.render('adults', {data: adults})
    })    
})

// POST
app.post("/addAdult", function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    let firstName = data.firstName;
    if (firstName === '') {
        firstName = 'NULL'
    }

    let lastName = data.lastName;
    if (lastName === '') {
        lastName = 'NULL'
    }

    let phone = data.phone;
    if (phone === '') {
        phone = 'NULL'
    }

    let email = data.email;
    if (email === '') {
        email = 'NULL'
    }

    let isGuardian = parseInt(data.isGuardian);
    if (isNaN(isGuardian)) {
        isGuardian = 'NULL'
    }

    let connectedAdultID = parseInt(data.connectedAdultID);
    if (isNaN(connectedAdultID)) {
        connectedAdultID = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Adults(firstName, lastName, phone, email, isGuardian, connectedAdultID)
    VALUES ('${firstName}', '${lastName}', '${phone}', '${email}', 
    '${isGuardian}', '${connectedAdultID}');`

    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a query2
            query2 = `SELECT * FROM Adults;`

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error){
                    // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else{
                    res.send(rows);
                }
            })
        }
    })
});

app.put("/updateAdult", function(req,res,next){
    let data = req.body;
    let adultID = parseInt(data.adultID);
    let firstName = data.firstName;
    let lastName = data.lastName;
    let phone = data.phone;
    let email = data.email;
    let isGuardian = parseInt(data.isGuardian);
    let connectedAdultID = parseInt(data.connectedAdultID);
    
    let query1 = `UPDATE Adults SET firstName = '${firstName}', lastName = '${lastName}', phone = '${phone}', email = '${email}', \
    isGuardian = '${isGuardian}', connectedAdultID = '${connectedAdultID}' \
    WHERE Adults.adultID = '${adultID}';`;
    let query2 = `SELECT * FROM Adults WHERE adultID = '${adultID}
                    ORDER BY lastName, firstName ASC';`;


    // Run the 1st query
    db.pool.query(query1, [firstName, lastName, phone, email, isGuardian, connectedAdultID], function(error, rows, fields){
        if (error){
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    
        else{
            // Run the second query
            db.pool.query(query2, [firstName, lastName, phone, email, isGuardian, connectedAdultID], function(error, rows, fields) {
            
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } 
                
                else{
                    console.log(`Rows are ${rows}`)
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE
app.delete("/deleteAdult", function(req,res,next){
    let data = req.body;
    let adultID = parseInt(data.adultID);
    let query1 = `DELETE FROM Adults WHERE adultID = ?`;

    // Run the 1st query
    db.pool.query(query1, [adultID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else{
            res.sendStatus(204);
        }
  })
});


/*
    PLAYERS ROUTES
*/

// GET
app.get('/players', function(req, res){
    let query1;
    let query2;
    if(req.query.divisionID === undefined){
        query1 = "SELECT Players.playerID AS '_', Seasons.description AS 'RecentSeason', Divisions.description AS 'Division', Teams.name AS 'RecentTeam', \
        CONCAT(Players.firstName, ' ', Players.lastName) AS 'PlayerName', \
        Players.gender AS 'Gender', CAST(Players.dob AS varchar(10)) AS 'DOB',\
        CONCAT(Adults.firstName, \
        ' ', Adults.lastName) as 'Guardian', Adults.phone AS 'ContactPhone', Adults.email AS 'ContactEmail' FROM Players \
        INNER JOIN Adults ON Players.primaryAdultID = Adults.adultID \
        INNER JOIN Teams ON Players.playerTeamID = Teams.teamID \
        INNER JOIN Forms ON Players.playerID = Forms.registeredPlayerID \
        INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID \
        INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID \
        INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID \
        ORDER BY Divisions.description ASC, Teams.name ASC, Players.lastName ASC, Players.firstName ASC \
        ;";

        query2 = "SELECT * FROM Teams;";
}
    else{
        query1 = `SELECT Players.playerID AS '_', Seasons.description AS 'RecentSeason', Divisions.description AS 'Division', Teams.name AS 'RecentTeam', \
        CONCAT(Players.firstName, ' ', Players.lastName) AS 'PlayerName', \
        Players.gender AS 'Gender', CAST(Players.dob AS varchar(10)) AS 'DOB',\
        CONCAT(Adults.firstName, \
        ' ', Adults.lastName) as 'Guardian', Adults.phone AS 'ContactPhone', Adults.email AS 'ContactEmail' FROM Players \
        INNER JOIN Adults ON Players.primaryAdultID = Adults.adultID \
        INNER JOIN Teams ON Players.playerTeamID = Teams.teamID \
        INNER JOIN Forms ON Players.playerID = Forms.registeredPlayerID \
        INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID \
        INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID \
        INNER JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID \
        WHERE Divisions.divisionID LIKE ${req.query.searchDivisionID} \
        ORDER BY Divisions.description ASC, Teams.name ASC, Players.lastName ASC, Players.firstName ASC \
        ;` ;

        query2 = `SELECT * FROM Teams WHERE divisionID = ${req.query.searchDivisionID};`;
    }
        let query3 = "SELECT * FROM Divisions;";

        db.pool.query(query1, function(error, rows, fields){
            let players = rows;
                
            db.pool.query(query2, function(error, rows, fields){

            let teams = rows;
            
                db.pool.query(query3, (error, rows, fields)=>{
                    let divisions = rows;

                    return res.render('players', {data: players, 
                        teams: teams,
                         divisions: divisions});
                })
            })
        })
    });     

// POST
app.post('/insertPlayerAjax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let primaryAdultID = parseInt(data['primaryAdultID']);
    if (isNaN(primaryAdultID)){
        primaryAdultID = 'NULL';
    }

    let teamID = parseInt(data['teamID']);
    if (isNaN(teamID)){
        teamID = 'NULL';
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Players (firstName, lastName, Gender, DOB, primaryAdultID, playerTeamID)
    VALUES ('${data['firstName']}', '${data['lastName']}', '${data['Gender']}', '${data['DOB']}', '${primaryAdultID}', '${teamID}')`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if(error){
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else{
            query2 = `SELECT Players.playerID, Players.firstName, Players.lastName, Players.Gender, CAST(Players.DOB AS varchar(10)) AS 'DOB',  CONCAT(Adults.firstName, ' ', Adults.lastName) as 'primaryAdultID', Teams.name AS 'playerTeamID' FROM Players
            INNER JOIN Adults ON Players.primaryAdultID = Adults.adultID
            LEFT JOIN Teams ON Players.playerTeamID = Teams.teamID
            ORDER BY Players.playerID`;
            db.pool.query(query2, function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.send(rows);
                }
            })
        }
    })
});


// PUT
app.put('/putPlayer', function(req,res,next){
    let data = req.body;
    let player = parseInt(data.players);
    let teamID = parseInt(data.teamID);

    if(isNaN(teamID)){
        teamID = 'NULL';
    }

    let queryUpdate = `UPDATE Players SET Players.playerTeamID = ? \
    WHERE Players.playerID = ?`;

    // Run the 1st query
    db.pool.query(queryUpdate, [teamID, player], 
        function(error, rows, fields){
        if(error){
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else{
            res.send(rows);
        }
    })
    
});


// DELETE
app.delete("/deletePlayer", function(req,res,next){
    let data = req.body;
    let playerID = parseInt(data.playerID);
    let query1 = `DELETE FROM Players WHERE playerID = '${playerID}'`;

    // Run the 1st query
    db.pool.query(query1, [playerID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  })});



/*
  VOLUNTEERS ROUTES
*/
// GET
app.get('/volunteers', function(req, res){
    let query1;
    if(req.query.role === undefined){
        query1 = "SELECT volunteerID AS '_', Seasons.description AS 'Season', \
        Divisions.description AS 'Division',  Teams.name AS 'Team', \
        CONCAT (Adults.firstName, ' ', Adults.lastName) AS 'Name', \
        Volunteers.role AS 'Role', Volunteers.details AS 'Details', \
        Adults.phone AS 'Phone', Adults.email AS 'email'\
        FROM Volunteers \
        LEFT JOIN Teams ON Volunteers.teamID = Teams.teamID \
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID \
        LEFT JOIN Forms ON Adults.adultID = Forms.registeredAdultID \
        LEFT JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID \
        LEFT JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID \
        LEFT JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID \
        ORDER BY Adults.lastName ASC, Adults.firstName ASC, Role ASC \
        ;";
}
    else{
        query1 = `SELECT volunteerID AS '_', Seasons.description AS 'Season', \
        Divisions.description AS 'Division',  Teams.name AS 'Team', \
        CONCAT (Adults.firstName, ' ', Adults.lastName) AS 'Name', \
        Volunteers.role AS 'Role', Volunteers.details AS 'Details', \
        Adults.phone AS 'Phone', Adults.email AS 'email'\
        FROM Volunteers \
        LEFT JOIN Teams ON Volunteers.teamID = Teams.teamID \
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID \
        LEFT JOIN Forms ON Adults.adultID = Forms.registeredAdultID \
        LEFT JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID \
        LEFT JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID \
        LEFT JOIN Divisions ON Divisions.divisionID = SeasonsDivisions.divisionID \
        WHERE Volunteers.role LIKE '%${req.query.role}%' \
        ORDER BY Adults.lastName ASC, Adults.firstName ASC, Role ASC \
        ;` 
    }

        let query2 = "SELECT role FROM Volunteers \
                    GROUP BY role\
                    ORDER BY role;";

        let query3 = "SELECT * FROM Teams\
                        ORDER BY name;";

        db.pool.query(query1, function(error, rows, fields){
            let data = rows;

            db.pool.query(query2, (error, rows, fields)=>{
                let volunteers = rows;
                
                db.pool.query(query3, (error, rows, fields)=>{
                    let teams = rows;

                    return res.render('volunteers', {data: data, 
                        volunteers: volunteers, teams: teams});
                })
            })
        })
    });     

// POST
app.post('/insertVolunteerAjax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let connectedAdultID = parseInt(data['connectedAdultID']);
    if (isNaN(connectedAdultID)){
        connectedAdultID = 'NULL'
    }

    let isGuardian = parseInt(data['isGuardian']);
    if (isNaN(isGuardian)){
        isGuardian = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Adults (firstName, lastName, phone, email, isGuardian, connectedAdultID)
    VALUES ('${data['firstName']}', '${data['lastName']}', '${data['phone']}', '${data['email']}', ${isGuardian}, ${connectedAdultID})`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if(error){
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else{
        // If joining as a volunteer
            query2 = `SELECT MAX(adultID) as adultID FROM Adults`;
            db.pool.query(query2, function(error, row, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } 
                else{
                    let parseAdultID = parseInt(row[0].adultID);
                    query3 = `INSERT INTO Volunteers (role, details, adultID)
                    VALUES ('${data['volunteerRole']}', '${data['volunteerDetails']}', ${parseAdultID})`;
                    db.pool.query(query3, function(error, rows, fields){
                        // If there was an error on the second query, send a 400
                        if (error){
                            console.log(error);
                            res.sendStatus(400);
                        }
                        // If all went well, send the results of the query back.
                        else{
                            console.log('volunteer adultID = ', parseAdultID);
                            res.sendStatus(200);
                        }            
                    })
                }
            })
        }
    })
});


app.post('/addVolunteerTeam', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let volunteer = parseInt(data.volunteers);
    let teamID = parseInt(data.teamID);
    

    // Capture NULL values

    if(isNaN(teamID)){
        teamID = 'NULL';
    }

    // Create the query and run it on the database
    
    query1 = `INSERT INTO Volunteers (role, details, adultID, teamID) \
    SELECT role, details, adultID, teamID FROM Volunteers WHERE volunteerID = ${volunteer};\
    `
    if(data.details === "none"){
    query2 = `UPDATE Volunteers SET teamID = ${teamID}\
      WHERE volunteerID = ${volunteer};`
    }

    else if(teamID === 0){
        query2 = `UPDATE Volunteers SET details = '${data.details}'\
        WHERE volunteerID = ${volunteer};`
    }

    else{
        query2 = `UPDATE Volunteers SET teamID = ${teamID},\
        details = '${data.details}' WHERE volunteerID = ${volunteer};`
    }
    
    // run the 1st query
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error){
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else{
            // Run the second query
            db.pool.query(query2, [teamID, data.details, volunteer], function(error, rows, fields) {
            
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } 
            
                    else{
                    res.send(rows);
                    }
                
                        
            })       
        }
    })
})
;


// PUT
app.put('/putVolunteerTeam', function(req,res,next){
    let data = req.body;
    let volunteer = parseInt(data.volunteers);
    let teamID = parseInt(data.teamID);
    let details = data.details;

    if(isNaN(teamID)){
        teamID = 'NULL';
    }

    let queryUpdate
    if(details === "none"){
    
        queryUpdate = `UPDATE Volunteers SET Volunteers.teamID = ? WHERE Volunteers.volunteerID = ?;`;

        // Run the 1st query
        db.pool.query(queryUpdate, [teamID, volunteer], 
        function(error, rows, fields){
            if(error){
                // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
            else{
                res.send(rows);
            }
        })

    }

    else{

        if(teamID === 0){
            queryUpdate = `UPDATE Volunteers SET Volunteers.details = ? WHERE Volunteers.volunteerID = ?;`;

            db.pool.query(queryUpdate, [details, volunteer], 
                function(error, rows, fields){
                    if(error){
                        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else{
                        res.send(rows);
                    }
                })

        }

        else{

            queryUpdate = `UPDATE Volunteers SET Volunteers.teamID = ?, Volunteers.details = ? WHERE Volunteers.volunteerID = ?;`;

                db.pool.query(queryUpdate, [teamID, details, volunteer], 
                function(error, rows, fields){
                    if(error){
                        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else{
                        res.send(rows);
                    }
                })
        }    
    }
});

app.put('/putVolunteerDetails', function(req,res,next){
    let data = req.body;
    let volunteer = parseInt(data.volunteers);
    let details = data.details;

    let queryUpdate
    if(details === NULL){
    
        queryUpdate = `UPDATE Volunteers SET Volunteers.teamID = ? WHERE Volunteers.volunteerID = ?;`;

        // Run the 1st query
        db.pool.query(queryUpdate, [teamID, volunteer], 
        function(error, rows, fields){
            if(error){
                // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
            else{
                res.send(rows);
            }
        })

    }

    else{
    queryUpdate = `UPDATE Volunteers SET Volunteers.teamID = ?, Volunteers.details = ? WHERE Volunteers.volunteerID = ?;`;

        db.pool.query(queryUpdate, [teamID, volunteer], 
            function(error, rows, fields){
                if(error){
                    // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.send(rows);
                }
            })
    }


    
    
});

// DELETE
app.delete("/deleteVolunteer", function(req,res,next){
    let data = req.body;
    let volunteerID = parseInt(data.volunteerID);
    let query1 = `DELETE FROM Volunteers WHERE volunteerID = '${volunteerID}'`;

    // Run the 1st query
    db.pool.query(query1, [volunteerID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  })});


/*
    GAMES ROUTES 
*/

// GET
app.get("/games", function(req, res) {
    let query1 = `SELECT gameID, DATE_FORMAT(Games.dateTime, '%Y-%m-%d %r') as dateTime, homeScore, awayScore, \
    fieldNumber, homeTeamID, awayTeamID, refereeID FROM Games;`;

    db.pool.query(query1, function(error, rows, fields) {
        let games = rows;
        return res.render('games', {data: games})
    })
})

// POST
app.post("/addGame", function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    let homeScore = parseInt(data.homeScore);
    if (isNaN(homeScore)) {
        homeScore = 'NULL'
    }

    let awayScore = parseInt(data.awayScore);
    if (isNaN(awayScore)) {
        awayScore = 'NULL'
    }

    let fieldNumber = parseInt(data.fieldNumber);
    if (isNaN(fieldNumber)) {
        fieldNumber = 'NULL'
    }

    let homeTeamID = parseInt(data.homeTeamID);
    if (isNaN(homeTeamID)) {
        homeTeamID = 'NULL'
    }

    let awayTeamID = parseInt(data.awayTeamID);
    if (isNaN(awayTeamID)) {
        awayTeamID = 'NULL'
    }

    let refereeID = parseInt(data.refereeID);
    if (isNaN(refereeID)) {
        refereeID = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Games(dateTime, homeScore, awayScore, fieldNumber, homeTeamID, awayTeamID, refereeID)
    VALUES ('${data.dateTime}', '${homeScore}', '${awayScore}', '${fieldNumber}', 
    '${homeTeamID}', '${awayTeamID}', '${refereeID}');`

    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a query2
            query2 = `SELECT * FROM Games;`

            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error){
                    // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else{
                    res.send(rows);
                }
            })
        }
    })
});

// PUT
app.put("/updateGame", function(req,res,next){
    let data = req.body;
    let gameID = parseInt(data.gameID);
    let dateTime = data.dateTime;
    let homeScore = parseInt(data.homeScore);
    let awayScore = parseInt(data.awayScore);
    let fieldNumber = parseInt(data.fieldNumber);
    let homeTeamID = parseInt(data.homeTeamID);
    let awayTeamID = parseInt(data.awayTeamID);
    let refereeID = parseInt(data.refereeID);
    
    // Capture NULL values
    if (dateTime === '') {
        dateTime = ''
    }

    if (isNaN(homeScore)) {
        homeScore = 'NULL'
    }

    if (isNaN(awayScore)) {
        awayScore = 'NULL'
    }

    if (isNaN(fieldNumber)) {
        fieldNumber = 'NULL'
    }

    if (isNaN(homeTeamID)) {
        homeTeamID = 'NULL'
    }

    if (isNaN(awayTeamID)) {
        awayTeamID = 'NULL'
    }

    if (isNaN(refereeID)) {
        refereeID = 'NULL'
    }

    let query1 = `UPDATE Games SET dateTime = '${dateTime}', homeScore = '${homeScore}', awayScore = '${awayScore}', fieldNumber = '${fieldNumber}', \
    homeTeamID = '${homeTeamID}', awayTeamID = '${awayTeamID}', refereeID = '${refereeID}' \
    WHERE Games.gameID = '${gameID}';`;
    let query2 = `SELECT * FROM Games WHERE gameID = '${gameID}';`;


    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        if (error){
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    
        else{
            // Run the second query
            db.pool.query(query2, function(error, rows, fields) {
            
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } 
                
                else{
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE
app.delete("/deleteGame", function(req,res,next){
    let data = req.body;
    let gameID = parseInt(data.gameID);
    let query1 = `DELETE FROM Games WHERE gameID = '${gameID}'`;

    // Run the 1st query
    db.pool.query(query1, [gameID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else{
            res.sendStatus(204);
        }
  })
});

/*
    ORDERS ROUTES
*/

// GET
app.get('/orders', (req, res) => {
    let query1;
    query1 = `SELECT * FROM Adults 
    ORDER BY Adults.lastName, Adults.firstName`;

    let query2;
    query2 = `SELECT Players.playerID, Players.firstName, Players.lastName, Players.Gender,  DATE_FORMAT(Players.DOB, '%Y-%m-%d') as DOB, CONCAT(Adults.firstName, ' ', Adults.lastName) AS primaryAdultID, Teams.name AS playerTeamID FROM Players
    INNER JOIN Adults ON Players.primaryAdultID = Adults.adultID
    LEFT JOIN Teams ON Players.playerTeamID = Teams.teamID
    ORDER BY Players.lastName, Players.firstName`;

    let query3;
    query3 = `SELECT * FROM Adults 
    ORDER BY Adults.lastName, Adults.firstName`;

    let query4 = `SELECT Adults.adultID, CONCAT(Adults.firstName, ' ', Adults.lastName) as adultName FROM Adults
    ORDER BY Adults.lastName, Adults.firstName`

    let query5 = `SELECT Teams.teamID, Teams.name FROM Teams
    ORDER BY Teams.name`

    let query6 = `SELECT SeasonsDivisions.seasonDivisionID, SeasonsDivisions.description FROM SeasonsDivisions
    ORDER BY SeasonsDivisions.description ASC`

    db.pool.query(query1, function(error, rows, fields){
        let adults = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let players = rows;
            db.pool.query(query3,(error, rows, fields) =>{
                let volunteers = rows;
                db.pool.query(query4,(error, rows, fields) =>{
                    let primaryAdults = rows;
                    db.pool.query(query5, (error, rows, fields) =>{
                        let teams = rows;
                        db.pool.query(query6, (error, rows, fields)=>{
                            let divisions = rows;
                            return res.render('orders', {data: adults, players: players, 
                                volunteers: volunteers, primaryAdults: primaryAdults, teams: teams, divisions: divisions});
                        }) 
                    })
                })
            })
        })
    })
});

// POST
app.post('/insertAdultAjax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Capture NULL values

    let connectedAdultID = parseInt(data['connectedAdultID']);
    if (isNaN(connectedAdultID)){
        connectedAdultID = 'NULL'
    }

    let isGuardian = parseInt(data['isGuardian']);
    if (isNaN(isGuardian)){
        isGuardian = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Adults (firstName, lastName, phone, email, isGuardian, connectedAdultID)
    VALUES ('${data['firstName']}', '${data['lastName']}', '${data['phone']}', '${data['email']}', ${isGuardian}, ${connectedAdultID});`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if(error){
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else{
        // If joining as a volunteer
            query2 = `SELECT MAX(adultID) as adultID FROM Adults;`;
            db.pool.query(query2, function(error, row, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                } 
                else{
                    let parseAdultID = parseInt(row[0].adultID);
                    if (data.isVolunteer === true){
                        query3 = `INSERT INTO Volunteers (role, details, adultID)
                        VALUES ('${data['volunteerRole']}', '${data['volunteerDetails']}', ${parseAdultID});`;
                        db.pool.query(query3, function(error, rows, fields){
                        // If there was an error on the second query, send a 400
                        if (error){
                            console.log(error);
                            res.sendStatus(400);
                            }
                        else{
                            console.log('volunteer adultID = ', parseAdultID);
                            //res.sendStatus(parseAdultID);
                            res.send(row);
                        }            
                        // If all went well, send the results of the query back.
                        })
                    }
                    else{
                        console.log('not volunteer adultID = ', parseAdultID);
                        //res.sendStatus(row[0].adultID);
                        //res.sendStatus(200);
                        res.send(row[0]);
                    }
                }
            })
        }
    })
});

app.post('/insertOrderAjax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


            query1 = `INSERT INTO Orders (orderDate, orderTotal, orderDetails, registeringAdultID)
            Values ('${data.orderDate}', ${data.orderTotal}, '${data.orderDetails}', '${data.orderAdultID}')`;
            db.pool.query(query1, function(error, rows, fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    query2 = `SELECT MAX(orderID) as orderID FROM Orders`;
                    db.pool.query(query2, function(error, row, fields){
                        if (error){
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else{
                            let parseOrderID = parseInt(row[0].orderID);
                            let parseFormDivsion = parseInt(data['formDivision'])
                            query3 = `INSERT INTO Forms (formDetails, orderID, seasonDivisionID, registeredPlayerID, registeredAdultID)
                                      VALUES('${data.formDetails}', ${parseOrderID}, ${parseFormDivsion}, '${data.orderPlayerID}', '${data.orderVolunteerID}')`;
                            db.pool.query(query3, function(error, rows, fields){
                                if (error){
                                    console.log(error);
                                    res.sendStatus(400);
                                }
                                else{
                                    // No table to update so just send back success status
                                    res.sendStatus(200);
                                }
                            })
                        }
                    })
                }
          
    })        
});

/*
    ORDER HISTORY ROUTES
*/

// GET
app.get('/orderhistory', (req, res) => {
    let query1;
    if (req.query.name === undefined) {
        query1 = "SELECT Orders.orderID, DATE_FORMAT(Orders.orderDate, '%Y-%m-%d') \
        AS orderDate, Orders.orderTotal, Orders.orderDetails, concat(Adults.firstName, ' ', Adults.lastName) AS 'registeringAdultID' FROM Orders \
        INNER JOIN Adults ON Adults.adultID = Orders.registeringAdultID";
    }
    db.pool.query(query1, function(error, rows, fields){
        let orderhistory = rows;
        return res.render('orderhistory', {data: orderhistory});
    })
});

/*
    FORMS ROUTES
*/

// GET
app.get('/forms', (req, res) => {
    let query1;
    if (req.query.name === undefined) {
        query1 = "SELECT Forms.formID, Forms.formDetails, Forms.orderID, \
        concat(Seasons.description, ' ', Divisions.description) as 'division', \
        concat(Players.firstName, ' ', Players.lastName) as 'player', \
        concat(Adults.firstName, ' ', Adults.lastName) as 'adult'  FROM Forms \
        INNER JOIN SeasonsDivisions ON Forms.seasonDivisionID = SeasonsDivisions.seasonDivisionID \
        INNER JOIN Seasons ON SeasonsDivisions.seasonID = Seasons.seasonID \
        INNER JOIN Divisions ON SeasonsDivisions.divisionID = Divisions.divisionID \
        LEFT JOIN Players ON Forms.registeredPlayerID = Players.playerID \
        LEFT JOIN Adults ON Forms.registeredAdultID = Adults.adultID \
        ORDER BY Forms.formID;";
    }

    db.pool.query(query1, function(error, rows, fields){
        let forms = rows;
        return res.render('forms', {data: forms});
    })
});


/*
    LISTENER 
*/

app.listen(PORT, function(){         
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
