//Justin Wang
// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

app.use(express.urlencoded({ extended: true }));

//retrieves information from public
app.use(express.static(__dirname + '/Public'));

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
        //check if no products were bought, set valid to false if so
        if(url == `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`){
            valid = false
        }
    }
    //if its false, return to the store with error=true
    if(valid == false)
    {
       
        response.redirect(`products_display.html?error=true` + url);
        
        
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

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));
