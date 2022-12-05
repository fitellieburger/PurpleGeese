/*
    Citation for the code turned in for CS 340 Step 5
    Date: 11/16/2022
    Adapted from Michael McDonell's adaptation of the Node Starter App
    Node Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deletePlayer(playerID) {
    // Put our data we want to send in a javascript object
    let data = {
        playerID: playerID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/deletePlayer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // if successful
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // refresh the page
            document.location.reload();

        }
        // if unsuccessful
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            // report to console and to user
            console.log("There was an error with the input.")
            alert("There has been an error. Please check your choices and try again.");
        return;
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


