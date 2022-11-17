/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addDivisionForm = document.getElementById('insertDivisionAjax');

// Modify the objects we need
addDivisionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDescription           = document.getElementById("inputDescription");
    let inputMinAge                = document.getElementById("inputMinAge");
    let inputMaxAge                = document.getElementById("inputMaxAge");
    let inputGender                = document.getElementById("inputGender");
    let inputMinPlayers            = document.getElementById("inputMinPlayers");
    let inputMaxPlayers            = document.getElementById("inputMaxPlayers");
    let inputBallSize              = document.getElementById("inputBallSize");
    let inputNetSize               = document.getElementById("inputNetSize");

    // Get the values from the form fields
    let descriptionValue          = inputDescription.value;
    let minAgeValue               = inputMinAge.value;
    let maxAgeValue               = inputMaxAge.value;
    let genderValue               = inputGender.value;
    let minPlayersValue           = inputMinPlayers.value;
    let maxPlayersValue           = inputMaxPlayers.value;
    let ballSizeValue             = inputBallSize.value;
    let netSizeValue              = inputNetSize.value;

    // Put our data we want to send in a javascript object
    let data = {
        description        : descriptionValue,
        minAge             : minAgeValue, 
        maxAge             : maxAgeValue,
        gender             : genderValue,
        minPlayers         : minPlayersValue,
        maxPlayers         : maxPlayersValue,
        ballSize           : ballSizeValue,
        netSize            : netSizeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addDivision", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDescription.value  = '';
            inputMinAge.value       = '';
            inputMaxAge.value       = '';
            inputGender.value       = '';
            inputMinPlayers.value   = '';
            inputMaxPlayers.value   = '';
            inputBallSize.value     = '';
            inputNetSize.value      = '';
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
    let currentTable = document.getElementById("divisionTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row                     = document.createElement("TR");
    let adultIDCell             = document.createElement("TD");
    let descriptionCell         = document.createElement("TD");
    let minAgeCell              = document.createElement("TD");
    let maxAgeCell              = document.createElement("TD");
    let genderCell              = document.createElement("TD");
    let ballSizeCell            = document.createElement("TD");
    let netSizeCell             = document.createElement("TD");
    // Delete functionality
    let deleteCell              = document.createElement("TD");

    // Fill the cells with correct data
    adultIDCell.innerText       = newRow.adultID;
    descriptionCell.innerText   = newRow.Description;
    minAgeCell.innerText        = newRow.lasName;
    maxAgeCell.innerText        = newRow.MaxAge;
    genderCell.innerText        = newRow.Gender;
    ballSizeCell.innerText      = newRow.ballSize;
    netSizeCell.innerText       = newRow.netSize;
    // Delete functionality
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTeam(newRow.teamID);
    };

    // Add the cells to the row 
    row.appendChild(adultIDCell);
    row.appendChild(descriptionCell);
    row.appendChild(minAgeCell);
    row.appendChild(maxAgeCell);
    row.appendChild(genderCell);
    row.appendChild(ballSizeCell);
    row.appendChild(netSizeCell);
    // Delete functionality
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.divisionID);
    // Add the row to the table
    currentTable.appendChild(row);

    //Update functionality
    let selectMenu  = document.getElementById("inputNameUpdate");
    let option      = document.createElement("option");
    option.text     = newRow.name;
    option.value    = newRow.teamID;
    selectMenu.add(option)
}