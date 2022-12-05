/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addTeamForm = document.getElementById('insertTeamAjax');

// Modify the objects we need
addTeamForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName           = document.getElementById("inputName");
    let inputMascot         = document.getElementById("inputMascot");
    let inputTeamDivisionID = document.getElementById("inputTeamDivisionID");
    let inputHeadCoachID    = document.getElementById("inputHeadCoachID");

    // Get the values from the form fields
    let nameValue           = inputName.value;
    let mascotValue         = inputMascot.value;
    let teamDivisionIDValue = inputTeamDivisionID.value;
    let headCoachIDValue    = inputHeadCoachID.value;

    // Put our data we want to send in a javascript object
    let data = {
        name             : nameValue,
        mascot           : mascotValue,
        teamDivisionID   : teamDivisionIDValue,
        headCoachID      : headCoachIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insertTeamAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value           = '';
            inputMascot.value         = '';
            inputTeamDivisionID.value = '';
            inputHeadCoachID.value    = '';
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
    let currentTable = document.getElementById("teamTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row                = document.createElement("TR");
    let teamIDCell         = document.createElement("TD");
    let nameCell           = document.createElement("TD");
    let mascotCell         = document.createElement("TD");
    let teamDivisionIDCell = document.createElement("TD");
    let headCoachIDCell    = document.createElement("TD");
    // Delete functionality
    let deleteCell         = document.createElement("TD");

    // Fill the cells with correct data
    teamIDCell.innerText         = newRow.teamID;
    nameCell.innerText           = newRow.name;
    mascotCell.innerText         = newRow.mascot;
    teamDivisionIDCell.innerText = newRow.teamDivisionID;
    headCoachIDCell.innerText    = newRow.headCoachID;
    // Delete functionality
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTeam(newRow.teamID);
    };

    // Add the cells to the row 
    row.appendChild(teamIDCell);
    row.appendChild(nameCell);
    row.appendChild(mascotCell);
    row.appendChild(teamDivisionIDCell);
    row.appendChild(headCoachIDCell);
    // Delete functionality
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.teamID);
    // Add the row to the table
    currentTable.appendChild(row);

    //Update functionality
    let selectMenu  = document.getElementById("inputNameUpdate");
    let option      = document.createElement("option");
    option.text     = newRow.name;
    option.value    = newRow.teamID;
    selectMenu.add(option)
}