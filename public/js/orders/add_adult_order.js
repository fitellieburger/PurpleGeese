/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let addAdultForm = document.getElementById('insertAdultAjaxForm');

// Modify the objects we need
addAdultForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName         = document.getElementById("inputFirstName");
    let inputLastName          = document.getElementById("inputLastName");
    let inputPhone             = document.getElementById("inputPhone");
    let inputEmail             = document.getElementById("inputEmail");
    let inputIsGuardian        = document.getElementById("inputIsGuardian");
    let inputConnectedAdultID  = document.getElementById("inputConnectedAdultID");

    let inputIsVolunteer       = document.getElementById("inputIsVolunteer");   
    let inputVolunteerRole     = document.getElementById("inputRole");
    let inputVolunteerDetails  = document.getElementById("inputDetails");

    // Get the values from the form fields
    let firstNameValue          = inputFirstName.value;
    let lastNameValue           = inputLastName.value;
    let phoneValue              = inputPhone.value;
    let emailValue              = inputEmail.value;
    let isGuardianValue         = inputIsGuardian.value;
    let connectedAdultIDValue   = inputConnectedAdultID.value;

    let isVolunteerValue        = inputIsVolunteer.checked;
    let volunteerRoleValue      = inputVolunteerRole.value;
    let volunteerDetailsValue   = inputVolunteerDetails.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName         : firstNameValue,
        lastName          : lastNameValue,
        phone             : phoneValue,
        email             : emailValue,
        isGuardian        : isGuardianValue,
        connectedAdultID  : connectedAdultIDValue,

        isVolunteer       : isVolunteerValue,
        volunteerRole     : volunteerRoleValue,
        volunteerDetails  : volunteerDetailsValue
    }
    console.log(data);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insertAdultAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.response);
            // Clear the input fields for another transaction
            inputFirstName.value         = '';
            inputLastName.value          = '';
            inputPhone.value             = '';
            inputEmail.value             = '';
            inputIsGuardian.value        = '';
            inputConnectedAdultID.value  = '';

            inputIsVolunteer.checked     = false;
            inputVolunteerRole.value     = '';
            inputVolunteerDetails.value  = '';
            addAdultToTable(xhttp.response);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input, where xhttp status != 200.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

addAdultToTable = (data) => {
    console.log("got to addAdultTable");
    let row = document.createElement("TR");
    let adultNameCell = document.createElement("TD");

    adultNameCell.innerText = data.firstName + ' ' + data.lastName;

    row.appendChild(adultNameCell);
}