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
  SEASONS ROUTES
*/
// GET
app.get('/seasons', function(req, res){
    let query1;
    if(req.query.divisionID === undefined){
        query1 = "SELECT  Seasons.seasonID, Seasons.description AS 'Season', CAST(startDate AS varchar(10)) AS 'StartDate',\
        CAST(endDate AS varchar(10)) AS 'EndDate', seasonFee AS 'Fee' FROM Seasons\
       LEFT JOIN SeasonsDivisions on Seasons.seasonID = SeasonsDivisions.seasonID\
       LEFT JOIN Divisions on SeasonsDivisions.divisionID = Divisions.divisionID\
        ORDER BY endDate DESC\
        ;";
}
    else{
        query1 = `SELECT  Seasons.seasonID, Seasons.description AS 'Season', CAST(startDate AS varchar(10)) AS 'StartDate',\
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

        let query3 = "SELECT * FROM Divisions;";

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
app.post('/add-season-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let seasonFee = parseInt(data['input-fee']);
    if (isNaN(seasonFee))
    {
        seasonFee = 'NULL'
    }

    // Create the query and run it on the database
    let query1 = `INSERT INTO Seasons (description, startDate, endDate, seasonFee)\
     VALUES ('${data['input-desc']}', '${data['input-startDate']}', '${data['input-endDate']}', ${seasonFee})\
     ;`
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
            res.redirect('/seasons');
        }
    })  
    })

/*
    DIVISIONS ROUTES 
*/

// GET 
app.get("/divisions", function(req, res) {
    let query1 = `SELECT * FROM Divisions;`;

    db.pool.query(query1, function(error, rows, fields) {
        let divisions = rows;
        return res.render('divisions', {data: divisions})
    })
    // let query1;
    // if () {
    //     query1 = ;
    // }
    // else {
    //     query1 = ;
    // }

    // let query2 = ;
    // let query3 = ;

    // db.pool.query(query1, function(error, rows, fields) {
    //     let divisions = rows;

    //     db.pool.query(query2, (error, rows, fields)=> {
    //         let placeholder = rows;

    //         db.pool.query(query3, (error, rows, fields)=> {
    //             let Placeholder = rows;

    //             return res.render('divisions', {data: divisions, placeholder: placeholder, Placeholder: Placeholder})
    //         })
    //     })
    // })
})

// POST
app.post("/addDivision", function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body
    
    // Capture NULL values
    let description = parseInt(data.description);
    if (isNaN(description)) {
        description = 'NULL'
    }

    let minAge = parseInt(data.minAge);
    if (isNaN(minAge)) {
        minAge = 'NULL'
    }

    let maxAge = parseInt(data.maxAge);
    if (isNaN(maxAge)) {
        maxAge = 'NULL'
    }

    let gender = parseInt(data.gender);
    if (isNaN(gender)) {
        gender = 'NULL'
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

    let netSize = parseInt(data.netSize);
    if (isNaN(netSize)) {
        netSize = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Divisions(description, minAge, maxAge, gender, minPlayers, maxPlayers, ballSize, netSize)
    VALUES ('${data.description}', '${data.minAge}', '${data.maxAge}', '${data.gender}', 
    '${data.minPlayers}', '${data.maxPlayers}', '${data.ballSize}', '${data.netSize}');`

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
    let description = parseInt(data.description);
    let minAge = parseInt(data.minAge);
    let maxAge = parseInt(data.maxAge);
    let gender = parseInt(data.gender);
    let minPlayers = parseInt(data.minPlayers);
    let maxPlayers = parseInt(data.maxPlayers);
    let ballSize = parseInt(data.ballSize);
    let netSize = parseInt(data.netSize);
    
    let query1 = `UPDATE Divisions SET description = ${description}, SET minAge = ${minAge}, SET maxAge = ${maxAge}, SET gender = ${gender}, \
    SET minPlayers = ${minPlayers}, SET maxPlayers = ${maxPlayers}, SET ballSize = ${ballSize}, SET netSize = ${netSize}\
    WHERE Divisions.DivisionID = ${divisionID};`;
    let query2 = `SELECT * FROM Divisions WHERE divisionID = ${divisionID};`;

    // Run the 1st query
    db.pool.query(query1, [description, minAge, maxAge, gender, minPlayers, maxPlayers, ballSize, netSize], function(error, rows, fields){
        if (error){
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    
        else{
            // Run the second query
            db.pool.query(query2, [description, minAge, maxAge, gender, minPlayers, maxPlayers, ballSize, netSize], function(error, rows, fields) {
            
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
  })});


  /*
  SEASONSDIVISIONS ROUTES
*/
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


/*
    TEAMS ROUTES
*/

// GET
app.get('/teams', function(req, res){
    let query1;
    if(req.query.name === undefined){
        query1 = "SELECT Teams.teamID, Teams.name, Teams.mascot, \
        Divisions.description as 'teamDivisionID', concat(Adults.firstName, \
        ' ', Adults.lastName) as 'headCoachID' FROM Teams \
        INNER JOIN Volunteers ON Teams.headCoachID = Volunteers.volunteerID \
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID \
        LEFT JOIN Divisions ON Teams.teamDivisionID = Divisions.divisionID \
        ORDER BY Teams.teamID;";
}
    else{
        query1 = `SELECT Teams.teamID, Teams.name, Teams.mascot, 
        Divisions.description as 'teamDivisionID', concat(Adults.firstName, 
        ' ', Adults.lastName) as 'headCoachID' FROM Teams 
        INNER JOIN Volunteers ON Teams.headCoachID = Volunteers.volunteerID 
        INNER JOIN Adults ON Volunteers.adultID = Adults.adultID 
        LEFT JOIN Divisions ON Teams.teamDivisionID = Divisions.divisionID 
        WHERE Teams.name LIKE "%${req.query.name}%"
        ORDER BY Teams.teamID` 
    }

        let query2 = "SELECT volunteerID, concat(Adults.firstName,' ' ,\
                    Adults.lastName) as 'coach' \
                    FROM Volunteers \
                    INNER JOIN Adults ON Volunteers.adultID = Adults.adultID\
                    WHERE Volunteers.role = 'Coach' \
                    ORDER BY Adults.adultID;";

        let query3 = "SELECT * FROM Divisions;";

        db.pool.query(query1, function(error, rows, fields){
            let teams = rows;

            db.pool.query(query2, (error, rows, fields)=>{
                let volunteers = rows;
                
                db.pool.query(query3, (error, rows, fields)=>{
                    let divisions = rows;

                    return res.render('Teams', {data: teams, 
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
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error){
            // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else{
            // If there was no error, perform a query2
            query2 = `SELECT * FROM Teams;`;
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
    let query1 = `SELECT adultID AS '_', firstName, lastName, phone, email from Adults
    ORDER BY Adults.lastName ASC, Adults.firstName ASC
    ;`;

    db.pool.query(query1, function(error, rows, fields) {
        let adults = rows;
        return res.render('adults', {data: adults})
    })

    // if () {
    //     query1 = ;
    // }
    // else {
    //     query1 = ;
    // }

    // let query2 = ;
    // let query3 = ;

    // db.pool.query(query1, function(error, rows, fields) {
    //     let adults = rows;

    //     db.pool.query(query2, (error, rows, fields)=> {
    //         let placeholder = rows;

    //         db.pool.query(query3, (error, rows, fields)=> {
    //             let Placeholder = rows;

    //             return res.render('adults', {data: adults, placeholder: placeholder, Placeholder: Placeholder})
    //         })
    //     })
    // })
})

// POST
app.post("/addAdult", function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    let firstName = parseInt(data.firstName);
    if (isNaN(firstName)) {
        firstName = 'NULL'
    }

    let lastName = parseInt(data.lastName);
    if (isNaN(lastName)) {
        lastName = 'NULL'
    }

    let phone = parseInt(data.phone);
    if (isNaN(phone)) {
        phone = 'NULL'
    }

    let email = parseInt(data.email);
    if (isNaN(email)) {
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
    VALUES ('${data.firstName}', '${data.lastName}', '${data.phone}', '${data.email}', 
    '${data.isGuardian}', '${data.connectedAdultID}');`

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

// PUT
app.put("/updateAdult", function(req,res,next){
    let data = req.body;
    let adultID = parseInt(data.adultID);
    let firstName = parseInt(data.firstName);
    let lastName = parseInt(data.lastName);
    let phone = parseInt(data.phone);
    let email = parseInt(data.email);
    let isGuardian = parseInt(data.isGuardian);
    let connectedAdultID = parseInt(data.connectedAdultID);
    
    let query1 = `UPDATE Adults SET firstName = ${firstName}, SET lastName = ${lastName}, SET phone = ${phone}, SET email = ${email}, \
    SET isGuardian = ${isGuardian}, SET connectedAdultID = ${connectedAdultID} \
    WHERE Adults.adultID = ${adultID};`;
    let query2 = `SELECT * FROM Adults WHERE adultID = ${adultID};`;


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
    let query1 = `DELETE FROM Adults WHERE adultID = ${adultID}`;

    // Run the 1st query
    db.pool.query(query1, [adultID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  })});

/*
    PLAYERS ROUTES
*/

// GET
app.get('/players', function(req, res){
    let query1;
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
        ;` 
    }

        let query2 = "SELECT volunteerID, concat(Adults.firstName,' ' ,\
                    Adults.lastName) as 'coach' \
                    FROM Volunteers \
                    INNER JOIN Adults ON Volunteers.adultID = Adults.adultID\
                    WHERE Volunteers.role = 'Coach' \
                    ORDER BY Adults.adultID;";

        let query3 = "SELECT * FROM Divisions;";

        db.pool.query(query1, function(error, rows, fields){
            let players = rows;

            db.pool.query(query2, (error, rows, fields)=>{
                let volunteers = rows;
                
                db.pool.query(query3, (error, rows, fields)=>{
                    let divisions = rows;

                    return res.render('players', {data: players, 
                        volunteers: volunteers, divisions: divisions});
                })
            })
        })
    });     

// POST


// DELETE
app.delete('/deletePlayerAjax/', function(req,res,next){
    let data = req.body;
    let thisPlayer = parseInt(data.playerID);
    let deletePlayer = `DELETE FROM Players WHERE playerID = ${thisPlayer};`;

    // Run the 1st query
    db.pool.query(deletePlayer, [thisPlayer], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    else {
        res.sendStatus(204);
    }
  })});





/*
  VOLUNTEERS ROUTES
*/
app.get('/volunteers', function(req, res){
    let query1;
    if(req.query.role === undefined){
        query1 = "SELECT volunteerID, Seasons.description AS 'Season', \
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
        query1 = `SELECT volunteerID, Seasons.description AS 'Season', \
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

        let query2 = "SELECT volunteerID, concat(Adults.firstName,' ' ,\
                    Adults.lastName) as 'coach' \
                    FROM Volunteers \
                    INNER JOIN Adults ON Volunteers.adultID = Adults.adultID\
                    WHERE Volunteers.role = 'Coach' \
                    ORDER BY Adults.adultID;";

        let query3 = "SELECT * FROM Divisions;";

        db.pool.query(query1, function(error, rows, fields){
            let data = rows;

            db.pool.query(query2, (error, rows, fields)=>{
                let volunteers = rows;
                
                db.pool.query(query3, (error, rows, fields)=>{
                    let divisions = rows;

                    return res.render('volunteers', {data: data, 
                        volunteers: volunteers, divisions: divisions});
                })
            })
        })
    });     




/*
    GAMES ROUTES 
*/

// GET
app.get("/games", function(req, res) {
    let query1 = `SELECT * FROM Games;`;

    db.pool.query(query1, function(error, rows, fields) {
        let games = rows;
        return res.render('games', {data: games})
    })
    // let query1;
    // if () {
    //     query1 = ;
    // }
    // else {
    //     query1 = ;
    // }

    // let query2 = ;
    // let query3 = ;

    // db.pool.query(query1, function(error, rows, fields) {
    //     let games = rows;

    //     db.pool.query(query2, (error, rows, fields)=> {
    //         let placeholder = rows;

    //         db.pool.query(query3, (error, rows, fields)=> {
    //             let Placeholder = rows;

    //             return res.render('games', {data: games, placeholder: placeholder, Placeholder: Placeholder})
    //         })
    //     })
    // })
})

// POST
app.post("/addGame", function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    let dateTime = parseInt(data.dateTime);
    if (isNaN(dateTime)) {
        dateTime = 'NULL'
    }

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
    VALUES ('${data.dateTime}', '${data.homeScore}', '${data.awayScore}', '${data.fieldNumber}', 
    '${data.homeTeamID}', '${data.awayTeamID}', '${data.refereeID}');`

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
    let dateTime = parseInt(data.dateTime);
    let homeScore = parseInt(data.homeScore);
    let awayScore = parseInt(data.awayScore);
    let fieldNumber = parseInt(data.fieldNumber);
    let homeTeamID = parseInt(data.homeTeamID);
    let awayTeamID = parseInt(data.awayTeamID);
    let refereeID = parseInt(data.refereeID);
    
    let query1 = `UPDATE Games SET dateTime = ${dateTime}, SET homeScore = ${homeScore}, SET awayScore = ${awayScore}, SET fieldNumber = ${fieldNumber}, \
    SET homeTeamID = ${homeTeamID}, SET awayTeamID = ${awayTeamID}, SET refereeID = ${refereeID} \
    WHERE Games.gameID = ${gameID};`;
    let query2 = `SELECT * FROM Games WHERE gameID = ${gameID};`;


    // Run the 1st query
    db.pool.query(query1, [placeholder, placeholder2], function(error, rows, fields){
        if (error){
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
    
        else{
            // Run the second query
            db.pool.query(query2, [placeholder], function(error, rows, fields) {
            
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
    let query1 = `DELETE FROM Games WHERE gameID = ${gameID}`;

    // Run the 1st query
    db.pool.query(query1, [gameID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal and send an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  })});




/*
    LISTENER - mcdonem2
*/

app.listen(PORT, function(){         
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});