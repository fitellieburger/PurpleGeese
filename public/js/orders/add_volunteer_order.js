/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

myAdult = "NULL";

function useAdult(thisAdult){
        myAdult = thisAdult;
}


// Get the objects we need to modify
let addVolunteerForm = document.getElementById('insertVolunteerAjaxForm');

// Modify the objects we need
addVolunteerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName         = document.getElementById("inputFirstNameV");
    let inputLastName          = document.getElementById("inputLastNameV");
    let inputPhone             = document.getElementById("inputPhoneV");
    let inputEmail             = document.getElementById("inputEmailV");
    let inputIsGuardian        = document.getElementById("inputIsGuardianV");
    let inputConnectedAdultID  = document.getElementById("inputConnectedAdultIDV");

    let inputVolunteerRole     = document.getElementById("inputRoleV");
    let inputVolunteerDetails  = document.getElementById("inputDetailsV");
    let inputTeamID            = document.getElementById("inputTeamIDV");

    // Get the values from the form fields
    let firstNameValue          = inputFirstName.value;
    let lastNameValue           = inputLastName.value;
    let phoneValue              = inputPhone.value;
    let emailValue              = inputEmail.value;
    let isGuardianValue         = inputIsGuardian.value;
    let connectedAdultIDValue   = inputConnectedAdultID.value;

    let volunteerRoleValue      = inputVolunteerRole.value;
    let volunteerDetailsValue   = inputVolunteerDetails.value;
    let teamIDValue             = inputTeamID.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName         : firstNameValue,
        lastName          : lastNameValue,
        phone             : phoneValue,
        email             : emailValue,
        isGuardian        : isGuardianValue,
        connectedAdultID  : connectedAdultIDValue,
        
        volunteerRole     : volunteerRoleValue,
        volunteerDetails  : volunteerDetailsValue,
        teamID            : teamIDValue,
        
        regAdult          : myAdult
    }
    console.log(data);
    var xhttp = new XMLHttpRequest();
    if (myAdult === "NULL") {
        xhttp.open("POST", "/insertVolunteerAjax", true);
    }

    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("status == 200");
            // Clear the input fields for another transaction
            inputFirstName.value         = '';
            inputLastName.value          = '';
            inputPhone.value             = '';
            inputEmail.value             = '';
            inputIsGuardian.value        = '';
            inputConnectedAdultID.value  = '';
            inputTeamID.value            = '';

            inputVolunteerRole.value     = '';
            inputVolunteerDetails.value  = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input, where xhttp status != 200.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})