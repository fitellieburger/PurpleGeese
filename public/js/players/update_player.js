/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let updatePlayerForm = document.getElementById('updatePlayerhtml');

  
// Modify the objects we need
updatePlayerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

        // select every player checked in the table
        let controls = document.getElementsByName("update");
        let SelectedValues = [];
        // count how many players have been selected
        let count = 0;
    
        // for every player
        for(var i=0; i < controls.length; i++){
            
            // if selected
            if(controls[i].checked === true){
                
                //increase player count; add playerID to list
                count++
                SelectedValues.push(controls[i].value);
            }
        }

    // if no player is selected, alert user and return
    if(SelectedValues.length === 0){
        alert("Please select at least 1 player.");
        return;
    }

    // Get form fields we need to get data from
    let playerList = SelectedValues;

    let team = document.getElementById("teamUpdate");

    // Get the values from the form fields
    let teamValue = team.value;

    
    for(k=0; k<=count-1; k++){
        // Put our data we want to send in a javascript object
        let data = {
            teamID: teamValue,
            players: playerList[k],
        }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/putPlayer", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // after last iteration, reload page
            if(k===count){
                location.reload();
            }

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {

            // report to console and to user
            console.log("There was an error with the input.")
            alert("There has been an error. Please check your choices and try again.");        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    }

})
