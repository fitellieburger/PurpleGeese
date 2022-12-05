/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let updateDivisionForm = document.getElementById('updateDivisionAjax');

// Modify the objects we need
updateDivisionForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let divisionID                 = document.getElementById("inputNameUpdate")
    let inputDescription           = document.getElementById("updateDescription");
    let inputMinAge                = document.getElementById("updateMinAge");
    let inputMaxAge                = document.getElementById("updateMaxAge");
    let inputGender                = document.getElementById("updateGender");
    let inputMinPlayers            = document.getElementById("updateMinPlayers");
    let inputMaxPlayers            = document.getElementById("updateMaxPlayers");
    let inputBallSize              = document.getElementById("updateBallSize");
    let inputNetSize               = document.getElementById("updateNetSize");

    // Get the values from the form fields
    let divisionIDValue           = divisionID.value;
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
        divisionID         : divisionIDValue,
        description        : descriptionValue,
        minAge             : minAgeValue, 
        maxAge             : maxAgeValue,
        gender             : genderValue,
        minPlayers         : minPlayersValue,
        maxPlayers         : maxPlayersValue,
        ballSize           : ballSizeValue,
        netSize            : netSizeValue
    }
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updateDivision", true);
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


function updateRow(data, divisionID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("divisionTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == divisionID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of all data value
            let tdDescription = updateRowIndex.getElementsByTagName("td")[1];
            let tdMinAge = updateRowIndex.getElementsByTagName("td")[2];
            let tdMaxAge = updateRowIndex.getElementsByTagName("td")[3];
            let tdGender = updateRowIndex.getElementsByTagName("td")[4];
            let tdMinPlayers = updateRowIndex.getElementsByTagName("td")[5];
            let tdMaxPlayers = updateRowIndex.getElementsByTagName("td")[6];
            let tdBallSize = updateRowIndex.getElementsByTagName("td")[7];
            let tdNetSize = updateRowIndex.getElementsByTagName("td")[8];

            // Reassign data to our value we updated to
            console.log(td);
             
            tdDescription.innerHTML = parsedData[1]; 
            tdMinAge.innerHTML = parsedData[2]; 
            tdMaxAge.innerHTML = parsedData[3]; 
            tdGender.innerHTML = parsedData[4]; 
            tdMinPlayers.innerHTML = parsedData[5]; 
            tdMaxPlayers.innerHTML = parsedData[6]; 
            tdBallSize.innerHTML = parsedData[7]; 
            tdNetSize.innerHTML = parsedData[8];
       }
    }
}
