//Justin Wang
// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

app.use(express.urlencoded({ extended: true }));

//retrieves information from public
app.use(express.static(__dirname + '/Public'));

const fs = require("fs");
const qs = require("querystring");
const crypto = require('crypto');

let raw_user_reg_data = fs.readFileSync("./user_data.json");
let user_reg_data = JSON.parse(raw_user_reg_data);

//input the product array from the json file
let products = require(__dirname + '/products.json');
products.forEach( (prod,i) => {prod.total_sold = 0});

// Define a route for handling a GET request to a path that matches "./products.js"
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    let products_str = `var products = ${JSON.stringify(products)};`;
    //console.log(products_str);
    response.send(products_str);
});


//post for process form is recieved
app.post("/process_form", function (request, response) {

    //get the textbox inputs in an array
    let qtys = request.body[`quantity_textbox`];
    //initially set the valid check to true
    let valid = true;
    //instantiate an empty string to hold the url
    let url = '';
    let soldArray =[];


    //for each member of qtys
    for (i in qtys) {
        
        //set q for number
        let q = Number(qtys[i]);
        
        //console.log(validateQuantity(q));
        //if the validate quantity string is empty
        if (validateQuantity(q)=='') {
            //check if we will go into the negative if we buy this, set valid to false if so
            if(products[i]['qty_available'] - Number(q) < 0){
                valid = false;
                url += `&prod${i}=${q}`
            }
            // otherwise, add to total sold, and subtract from available
            else{
               
                soldArray[i] = Number(q);
                
                //add argument to url
                url += `&prod${i}=${q}`
            }
            
        }

        //if the validate quantity string has stuff in it, set valid to false
         else {
            
            valid = false;
            url += `&prod${i}=${q}`
        }

        if (request.body.user) {
            url += `&user=${request.body.user}`;
        }

        //check if no products were bought, set valid to false if so
        if(url == `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`){
            valid = false
        }
    }
    //if its false, return to the store with error=true
    if(valid == false)
    {
       
        response.redirect(`products_display.html?error=true` + url);
        
    // redirt to login if no account  
    } else if (!url.includes("user")) {
        response.redirect('./login.html?' + url);
    }
    //otherwise, redirect to the invoice with the url attached
    else{

         for (i in qtys)
        {
            //update total and qty only if everything is good
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
        }
        
        response.redirect('invoice.html?' + url);
        
    }
 });

// Route all other GET requests to files from the public directory

app.all('*', function (request, response, next) {
    //console.log(request.method + ' to ' + request.path);
    next();
 });

 //function to verify the amount; returns a string if it's not an integer, a negative number, or a combination of the two.
//if no errors in quantity, then it will return in empty string
function validateQuantity(quantity){
    //console.log(quantity);
    if(isNaN(quantity)){
        return "Not a Number";
    }else if (quantity<0 && !Number.isInteger(quantity)){
        return "Negative Inventory & Not an Integer";
    }else if (quantity <0){
        return "Negative Inventory";
    }else if(!Number.isInteger(quantity)){
        return "Not an Integer";
    }else{
        return"";
    }

}

//assignment 2

//post purchase
app.post("/purchase_logout", function (request, response) {
    // Loop through each product in the products array
    for (let i in products) {
        // Increment the quantity sold of the current product by the number specified in the temp_user object
        products[i].qty_sold += Number(temp_user[`qty${[i]}`]);
        // Decrease the available quantity of the current product by the number specified in the temp_user object
        products[i].qty_available = products[i].qty_available - Number(temp_user[`qty${[i]}`]);
    }

    // Write the updated products array to the products.json file
    fs.writeFile(__dirname + '/products.json', JSON.stringify(products), 'utf-8', (error) => {
        if (error) {
            // If there's an error while writing the file, log the error message
            console.log('error updating products', error);
        } else {
            // If the file is written successfully, log a success message
            console.log('File written successfully. Products are updated.');
        }
    });

    // Remove the 'email' and 'name' properties from the temp_user object
    delete temp_user['email'];
    delete temp_user['name'];

    // Redirect the user to the products_display.html page
    response.redirect('./products_display.html');
})



//post register 
app.post("/process_login", function(request,response) {
    user_arr = request.body["email"].split("@");
    attempted_user = user_arr[0].toLowerCase();
    attempted_pass = request.body['password'];
    delete request.body.email;
    delete request.body.password;
    delete request.body.submit;
    let data = qs.stringify(request.body);


    if (typeof user_reg_data[attempted_user] != undefined) {
        if (user_reg_data[attempted_user]["password"] == sha256(attempted_pass)){
            if (Object.keys(data).length !=2){
                response.redirect ("./products_display.html?user=" + attempted_user + data +"&submit=yes");
            } else {
                response.redirect("./products_display.html?user="+attempted_user);
            }
        } else{
            response.redirect("./login.html?error=pass&"+data);
        }
    } else {
        response.redirect("/login.html?error=user&" + data);
    }


})

// password encryption using crypto
function sha256(inputPass) {
    const hash = crypto.createHash('sha256');
    hash.update(inputPass);
    return hash.digest('hex');
}

// Registration Form (helped from EthanSchwartz)
//Declare registration errors
let registration_errors = {};

app.post("/process_register", function (request, response) {
    //Get user's input from form
    let reg_name = request.body.name;
    let reg_email = request.body.email.toLowerCase();
    let reg_password = request.body.password;
    let reg_confirm_password = request.body.confirm_password;

    //Validate Password
    validateConfirmPassword(reg_password, reg_confirm_password);
    validatePassword(reg_password);
    //Validate Email to see if it's only letters and "@"  "." and domain names
    validateEmail(reg_email);
    //Validate Name to see if it's only letters
    validateName(reg_name);


    //Server Response to check if there are no errors
    if (Object.keys(registration_errors).length == 0) {
        user_data[reg_email] = {};
        user_data[reg_email].name = reg_name;
        user_data[reg_email].password = reg_password;
        
        //Write the updated user_data object to the user_data.json file
        fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (error) => {
            if (error) {
                //If there's an error while writing the file, log the error message
                console.log('error updating user_data', error);
            } else {
                //If the file is written successfully, log a success message
                console.log('File written successfully. User data is updated.');

            //Add user's info to temp_user
            temp_user['name'] = reg_name;
            temp_user['email'] = reg_email;

            //console log temp_user
            console.log(temp_user);
            console.log(user_data);

            let params = new URLSearchParams(temp_user);
            response.redirect(`/invoice.html?regSuccess&valid&${params.toString()}`);
            }
        });
            
        
    }else { //If there are errors
        delete request.body.password;
        delete request.body.confirm_password;

        let params = new URLSearchParams(request.body);
        response.redirect(`/registration.html?${params.toString()}&${qs.stringify(registration_errors)}`);
    }
});
function validateConfirmPassword(password, confirm_password) {
    delete registration_errors['confirm_password_type'];
    console.log(registration_errors);

    if (confirm_password !== password) {
        registration_errors ['confirm_password_type'] = 'Passwords do not match';
    }
}

// Validate Password Function
function validatePassword(password) {
    if (password.length < 10 || password.length > 16) {
        registration_errors.password_error = "Password must be between 10 and 16 characters.";
    } else if (/\s/.test(password)) {
        registration_errors.password_error = "Password cannot contain spaces.";
    }
    // Add more password validation rules as needed
}


// Validate Email Function
function validateEmail(email) {
    // Basic email validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        registration_errors.email_error = "Invalid email format.";
    }
}

//Validate Name
function validateName(name) {
    // Basic name validation using a regular expression
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        registration_errors.name_error = "Invalid name format.";
    }
}


// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));
