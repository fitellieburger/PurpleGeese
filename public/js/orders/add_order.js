/*
    Citation for the code turned in for CS 340 Step 4
    Date: 11/10/2022
    Adapted fromNode Starter App
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

let addOrderForm = document.getElementById('insertOrderAjax');

// let currDate = new Date();

// inputOrderDate = [currDate.getFullYear(),
//     currDate.getMonth()+1,
//     currDate.getDate()].join('-')+' 00:00:00';

addOrderForm.addEventListener("submit", function(e){
    e.preventDefault();

    let inputOrderAdult      = document.getElementById("inputOrderAdult");
    let inputOrderPlayer     = document.getElementById("inputOrderPlayer");
    let inputOrderVolunteer  = document.getElementById("inputOrderVolunteer");
    let inputOrderDate       = document.getElementById("inputOrderDate");
    let inputOrderTotal      = document.getElementById("inputOrderTotal");
    let inputOrderDetails    = document.getElementById("inputOrderDetails");
    let inputFormDetails     = document.getElementById("inputFormDetails");
    let inputFormDivision    = document.getElementById("inputFormDivision");

    let orderAdultValue      = inputOrderAdult.value;
    let orderPlayerValue     = inputOrderPlayer.value;
    let orderVolunteerValue  = inputOrderVolunteer.value;
    let orderDateValue       = inputOrderDate.value;
    let orderTotal           = inputOrderTotal.value;
    let orderDetailsValue    = inputOrderDetails.value;
    let formDetailsValue     = inputFormDetails.value;
    let formDivisionValue    = inputFormDivision.value;

    let data = {
        orderDate        : orderDateValue,
        orderTotal       : orderTotal,
        orderDetails     : orderDetailsValue,
        orderAdultID     : orderAdultValue,
        orderPlayerID    : orderPlayerValue,
        orderVolunteerID : orderVolunteerValue,
        formDetails      : formDetailsValue,
        formDivision     : formDivisionValue
    }
    console.log(data);
    var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "/insertOrderAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            inputOrderAdult.value     = '';
            inputOrderPlayer.value    = '';
            inputOrderVolunteer.value = '';
            inputOrderDetails.value   = '';  
            inputFormDetails.value    = '';      
            inputFormDivision.value   = '';    
            inputOrderDate.value      = '';
            inputOrderTotal.value     = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    xhttp.send(JSON.stringify(data));
})