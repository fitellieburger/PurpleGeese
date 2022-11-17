/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addAdultForm = document.getElementById('insertAdultAjax');

// Modify the objects we need
addAdultForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName           = document.getElementById("inputFirstName");
    let inputLastName            = document.getElementById("inputLastName");
    let inputPhone               = document.getElementById("inputPhone");
    let inputEmail               = document.getElementById("inputEmail");
    let inputIsGuardian          = document.getElementById("inputIsGuardian");
    let inputConnectedAdultID    = document.getElementById("inputConnectedAdultID");

    // Get the values from the form fields
    let firstNameValue          = inputFirstName.value;
    let lastNameValue           = inputLastName.value;
    let phoneValue              = inputPhone.value;
    let emailValue              = inputEmail.value;
    let isGuardianValue         = inputIsGuardian.value;
    let connectedAdultIDValue   = inputConnectedAdultID.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName        : firstNameValue,
        lastNameValue    : lastNameValue, 
        phone            : phoneValue,
        email            : emailValue,
        isGuardian       : isGuardianValue,
        connectedAdultID : connectedAdultIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addAdult", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value           = '';
            inputLastName.value            = '';
            inputPhone.value               = '';
            inputEmail.value               = '';
            inputIsGuardian.value          = '';
            inputConnectedAdultID.value    = '';
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
    let currentTable = document.getElementById("adultTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row                     = document.createElement("TR");
    let adultIDCell             = document.createElement("TD");
    let firstNameCell           = document.createElement("TD");
    let lastNameCell            = document.createElement("TD");
    let phoneCell               = document.createElement("TD");
    let emailCell               = document.createElement("TD");
    let isGuardianCell          = document.createElement("TD");
    let connectedAdultIDCell    = document.createElement("TD");
    // Delete functionality
    let deleteCell         = document.createElement("TD");

    // Fill the cells with correct data
    adultIDCell.innerText           = newRow.adultID;
    firstNameCell.innerText         = newRow.firstName;
    lastNameCell.innerText          = newRow.lasName;
    phoneCell.innerText             = newRow.phone;
    emailCell.innerText             = newRow.email;
    isGuardianCell.innerText        = newRow.isGuardian;
    connectedAdultIDCell.innerText  = newRow.connectedAdultID;
    // Delete functionality
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAdult(newRow.adultID);
    };

    // Add the cells to the row 
    row.appendChild(adultIDCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(isGuardianCell);
    row.appendChild(connectedAdultIDCell);
    // Delete functionality
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.adultID);
    // Add the row to the table
    currentTable.appendChild(row);

    //Update functionality
    let selectMenu  = document.getElementById("inputNameUpdate");
    let option      = document.createElement("option");
    option.text     = newRow.name;
    option.value    = newRow.teamID;
    selectMenu.add(option)
}