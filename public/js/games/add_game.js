/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addGameForm = document.getElementById('insertGameAjax');

// Modify the objects we need
addGameForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDateTime           = document.getElementById("inputDateTime");
    let inputHomeScore          = document.getElementById("inputHomeScore");
    let inputAwayScore          = document.getElementById("inputAwayScore");
    let inputFieldNumber        = document.getElementById("inputFieldNumber");
    let inputHomeTeamID         = document.getElementById("inputHomeTeamID");
    let inputAwayTeamID         = document.getElementById("inputAwayTeamID");
    let inputRefereeID          = document.getElementById("inputRefereeID");
    
    // Get the values from the form fields
    let dateTimeValue           = inputDateTime.value;
    let homeScoreValue          = inputHomeScore.value;
    let awayScoreValue          = inputAwayScore.value;
    let fieldNumberValue        = inputFieldNumber.value;
    let homeTeamIDValue         = inputHomeTeamID.value;
    let awayTeamIDValue         = inputAwayTeamID.value;
    let refereeIDValue          = inputRefereeID.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        dateTime                : dateTimeValue,
        homeScore               : homeScoreValue, 
        awayScore               : awayScoreValue,
        fieldNumber             : fieldNumberValue,
        homeTeamID              : homeTeamIDValue,
        awayTeamID              : awayTeamIDValue,
        refereeID               : refereeIDValue
    }
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addGame", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDateTime.value     = '';
            inputHomeScore.value    = '';
            inputAwayScore.value    = '';
            inputFieldNumber.value  = '';
            inputHomeTeamID.value   = '';
            inputAwayTeamID.value   = '';
            inputRefereeID.value    = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("gameTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row                     = document.createElement("TR");
    let adultIDCell             = document.createElement("TD");
    let dateTimeCell            = document.createElement("TD");
    let homeScoreCell           = document.createElement("TD");
    let awayScoreCell           = document.createElement("TD");
    let fieldNumberCell         = document.createElement("TD");
    let refereeIDCell           = document.createElement("TD");
    // Delete functionality
    let deleteCell              = document.createElement("TD");

    // Fill the cells with correct data
    adultIDCell.innerText       = newRow.adultID;
    dateTimeCell.innerText      = newRow.dateTime;
    homeScoreCell.innerText     = newRow.homeScore;
    awayScoreCell.innerText     = newRow.awayScore;
    fieldNumberCell.innerText   = newRow.fieldNumber;
    refereeIDCell.innerText     = newRow.refereeID;
    // Delete functionality
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTeam(newRow.teamID);
    };

    // Add the cells to the row 
    row.appendChild(adultIDCell);
    row.appendChild(dateTimeCell);
    row.appendChild(homeScoreCell);
    row.appendChild(awayScoreCell);
    row.appendChild(fieldNumberCell);
    row.appendChild(refereeIDCell);
    // Delete functionality
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.gameID);
    // Add the row to the table
    currentTable.appendChild(row);

    //Update functionality
    let selectMenu  = document.getElementById("inputNameUpdate");
    let option      = document.createElement("option");
    option.text     = newRow.name;
    option.value    = newRow.teamID;
    selectMenu.add(option)
}
