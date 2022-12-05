/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let updateGameForm = document.getElementById('updateGameAjax');

// Modify the objects we need
updateGameForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let gameID                  = document.getElementById("inputNameUpdate");
    let inputDateTime           = document.getElementById("updateDateTime");
    let inputHomeScore          = document.getElementById("updateHomeScore");
    let inputAwayScore          = document.getElementById("updateAwayScore");
    let inputFieldNumber        = document.getElementById("updateFieldNumber");
    let inputHomeTeamID         = document.getElementById("updateHomeTeamID");
    let inputAwayTeamID         = document.getElementById("updateAwayTeamID");
    let inputRefereeID          = document.getElementById("updateRefereeID");
    
    // Get the values from the form fields
    let gameIDValue             = gameID.value;
    let dateTimeValue           = inputDateTime.value;
    let homeScoreValue          = inputHomeScore.value;
    let awayScoreValue          = inputAwayScore.value;
    let fieldNumberValue        = inputFieldNumber.value;
    let homeTeamIDValue         = inputHomeTeamID.value;
    let awayTeamIDValue         = inputAwayTeamID.value;
    let refereeIDValue          = inputRefereeID.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        gameID                  : gameIDValue,
        dateTime                : dateTimeValue,
        homeScoreValue          : homeScoreValue, 
        awayScore               : awayScoreValue,
        fieldNumber             : fieldNumberValue,
        homeTeamID              : homeTeamIDValue,
        awayTeamID              : awayTeamIDValue,
        refereeID               : refereeIDValue
    }
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updateGame", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, data);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, gameID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("gameTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == gameID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of mascot value
            let tdDateTime = updateRowIndex.getElementsByTagName("td")[1];
            let tdHomeScore = updateRowIndex.getElementsByTagName("td")[2];
            let tdAwayScore = updateRowIndex.getElementsByTagName("td")[3];
            let tdFieldNumber = updateRowIndex.getElementsByTagName("td")[4];
            let tdHomeTeamID = updateRowIndex.getElementsByTagName("td")[5];
            let tdAwayTeamID = updateRowIndex.getElementsByTagName("td")[6];
            let tdRefereeID = updateRowIndex.getElementsByTagName("td")[7];

            // Reassign mascot to our value we updated to
            console.log(td);
            tdDateTime.innerHTML = parsedData[1]; 
            tdHomeScore.innerHTML = parsedData[2];
            tdAwayScore.innerHTML = parsedData[3];
            tdFieldNumber.innerHTML = parsedData[4];
            tdHomeTeamID.innerHTML = parsedData[5];
            tdAwayTeamID.innerHTML = parsedData[6];
            tdRefereeID.innerHTML = parsedData[7];
       }
    }
}
