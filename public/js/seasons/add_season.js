/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addTeamForm = document.getElementById('addSeasonForm');

// Modify the objects we need
addTeamForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDesc           = document.getElementById("input-desc");
    let inputStartDate      = document.getElementById("input-startDate");
    let inputEndDate        = document.getElementById("input-endDate");
    let inputFee            = document.getElementById("input-fee");


    // Get the values from the form fields
    let descValue           = inputDesc.value;
    let startDateValue      = inputStartDate.value;
    let endDateValue        = inputEndDate.value;
    let feeValue            = inputFee.value;


    // validate data
    if(endDateValue <= startDateValue){
        alert("Please choose an end date later than your start date.");
        return;
    }

    if(feeValue < 0){
        alert("We are not paying kids to play soccer. Please re-Eneter the season fee.");
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        description      : descValue,
        startDate        : startDateValue,
        endDate          : endDateValue,
        fee              : feeValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addSeason", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            document.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


