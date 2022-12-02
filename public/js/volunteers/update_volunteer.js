/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let updateVolunteerForm = document.getElementById('updateVolunteerhtml');

  
// Modify the objects we need
updateVolunteerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

        // select every volunteer checked in the table
        let controls = document.getElementsByName("update");
        let SelectedValues = [];

        // count how many volunteers have been selected
        let count = 0;
    
        // for every volunteer
        for(var i=0; i < controls.length; i++){
            
            // if selected
            if(controls[i].checked === true){
                
                //increase volunteer count; add volunteerID to list
                count++
                SelectedValues.push(controls[i].value);
            }
        }

    // if no volunteer is selected, alert user and return
    if(SelectedValues.length === 0){
        alert("Please select at least 1 volunteer.");
        return;
    }

    // Get form fields we need to get data from
    let volunteerList = SelectedValues;

    let team = document.getElementById("teamUpdate");
    let details = document.getElementById("details");

    // Get the values from the form fields
    let teamValue = team.value;
    let detailsValue = details.value;

    if(detailsValue.length ===0){
        detailsValue = "none";
    }

    // determine whether team needs to be updated or added

    let addOrChange = document.getElementsByName("addOrChange");
    console.log(addOrChange);
    let updateChoice;

    //get radio button values
    for(j=0; j < addOrChange.length; j++){

        if(addOrChange[j].checked){
            updateChoice = addOrChange[j].value;
        }

    }

    // if no choice is made, a line is added

    if(updateChoice === "changeTeam")
    // for update in same line
    {
    for(k=0; k<=count-1; k++){
        // Put our data we want to send in a javascript object
        let data = {
            teamID: teamValue,
            volunteers: volunteerList[k],
            details: detailsValue
        }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/putVolunteerTeam", true);
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

}

//add a new line
else if (updateChoice === "addTeam"){
    for(k=0; k<=count-1; k++){
        // Put our data we want to send in a javascript object
        let data = {
            teamID: teamValue,
            volunteers: volunteerList[k],
            details: detailsValue
        }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addVolunteerTeam", true);
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

}

/*
else {
    for(k=0; k<=count-1; k++){
        // Put our data we want to send in a javascript object
        let data = {
            volunteers: volunteerList[k],
            details: detailsValue
        }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/putVolunteerDetails", true);
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

}
*/

})
