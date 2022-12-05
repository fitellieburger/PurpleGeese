/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteVolunteer(volunteerID) {
    // Put our data we want to send in a javascript object
    let data = {
        volunteerID: volunteerID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/deleteVolunteer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    // if successful
    if (xhttp.readyState == 4 && xhttp.status == 204) {

    }
    // if unsuccessful
    else if (xhttp.readyState == 4 && xhttp.status != 204) {
        // report to console and to user
        console.log("There was an error with the input.")
        alert("There has been an error. Please check your choices and try again.");
    return;
        }

    else{
        // refresh the page
        location.reload();
    }
    
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(volunteerID){

    let table = document.getElementById("volunteerTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == volunteerID) {
            table.deleteRow(i);
            break;
       }
    }
}