/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateTeamForm = document.getElementById('updateTeamAjax');

// Modify the objects we need
updateTeamForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("inputNameUpdate");
    let inputMascot = document.getElementById("inputMascotUpdate");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let mascotValue = inputMascot.value;
    console.log(nameValue);
    console.log(mascotValue);
    
    // Put our data we want to send in a javascript object
    let data = {
        teamName: nameValue,
        mascot: mascotValue,
    }
    console.log(data);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/putTeamAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, teamID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("teamTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == teamID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of mascot value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign mascot to our value we updated to
            console.log(td);
            td.innerHTML = parsedData[0]; 
       }
    }
}