/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addPlayerForm = document.getElementById('insertPlayerAjaxForm');

// Modify the objects we need
addPlayerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlayerFirstName  = document.getElementById("inputPlayerFirstName");
    let inputPlayerLastName   = document.getElementById("inputPlayerLastName");
    let inputGender           = document.getElementById("inputGender");
    let inputDOB              = document.getElementById("inputDOB");
    let inputPrimaryAdultID   = document.getElementById("inputPrimaryAdultID");
    let inputPlayerTeamID     = document.getElementById("inputPlayerTeamID");


    // Get the values from the form fields
    let firstNameValue        = inputPlayerFirstName.value;
    let lastNameValue         = inputPlayerLastName.value;
    let genderValue           = inputGender.value;
    let DOBValue              = inputDOB.value;
    let primaryAdultIDValue   = inputPrimaryAdultID.value;
    let playerTeamIDValue     = inputPlayerTeamID.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName       : firstNameValue,
        lastName        : lastNameValue,
        Gender          : genderValue,
        DOB             : DOBValue,
        primaryAdultID  : primaryAdultIDValue,
        teamID          : playerTeamIDValue
    }
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insertPlayerAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPlayerFirstName.value   = '';
            inputPlayerLastName.value    = '';
            inputGender.value            = '';
            inputDOB.value               = '';
            inputPrimaryAdultID.value    = '';
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
    let currentTable = document.getElementById("playerTable");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row                 = document.createElement("TR");
    let playerIDCell        = document.createElement("TD");
    let firstNameCell       = document.createElement("TD");
    let lastNameCell        = document.createElement("TD");
    let genderCell          = document.createElement("TD");
    let DOBCell             = document.createElement("TD");
    let primaryAdultIDCell  = document.createElement("TD");

    // Fill the cells with correct data
    playerIDCell       = newRow.adultID;
    firstNameCell      = newRow.firstName;
    lastNameCell       = newRow.lastName;
    genderCell         = newRow.gender;
    DOBCell            = newRow.DOB;
    primaryAdultIDCell = newRow.primaryAdultID;

    // Add the cells to the row 
    row.appendChild(playerIDCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(genderCell);
    row.appendChild(DOBCell);
    row.appendChild(primaryAdultIDCell);

    row.setAttribute('data-value', newRow.playerID);
    // Add the row to the table
    currentTable.appendChild(row);
}