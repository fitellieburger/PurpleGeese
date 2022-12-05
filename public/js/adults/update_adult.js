/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let updateadultForm = document.getElementById('updateAdultAjax');

// Modify the objects we need
updateadultForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let adultID                  = document.getElementById("updateNameUpdate")
    let inputFirstName           = document.getElementById("updateFirstName");
    let inputLastName            = document.getElementById("updateLastName");
    let inputPhone               = document.getElementById("updatePhone");
    let inputEmail               = document.getElementById("updateEmail");
    let inputIsGuardian          = document.getElementById("updateIsGuardian");
    let inputConnectedAdultID    = document.getElementById("updateConnectedAdultID");

    // Get the values from the form fields
    let adultIDValue            = adultID.value
    let firstNameValue          = inputFirstName.value;
    let lastNameValue           = inputLastName.value;
    let phoneValue              = inputPhone.value;
    let emailValue              = inputEmail.value;
    let isGuardianValue         = inputIsGuardian.value;
    let connectedAdultIDValue   = inputConnectedAdultID.value;

    
    // Put our data we want to send in a javascript object
    let data = {
        adultID          : adultIDValue,
        firstName        : firstNameValue,
        lastName         : lastNameValue, 
        phone            : phoneValue,
        email            : emailValue,
        isGuardian       : isGuardianValue,
        connectedAdultID : connectedAdultIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updateAdult", true);
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


function updateRow(data, adultID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("adultTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == adultID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of mascot value
            let tdFirstName = updateRowIndex.getElementsByTagName("td")[1];
            let tdLastName = updateRowIndex.getElementsByTagName("td")[2];
            let tdPhone = updateRowIndex.getElementsByTagName("td")[3];
            let tdEmail = updateRowIndex.getElementsByTagName("td")[4];
            let tdIsGuardian = updateRowIndex.getElementsByTagName("td")[5];
            let tdConnectedAdultID = updateRowIndex.getElementsByTagName("td")[6];

            // Reassign mascot to our value we updated to
            tdFirstName.innerHTML = parsedData[1]; 
            tdLastName.innerHTML = parsedData[2];
            tdPhone.innerHTML = parsedData[3];
            tdEmail.innerHTML = parsedData[4];
            tdIsGuardian.innerHTML = parsedData[5];
            tdConnectedAdultID.innerHTML = parsedData[6];
       }
    }
}