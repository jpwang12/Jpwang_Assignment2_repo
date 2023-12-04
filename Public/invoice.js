//initializes variables
let extendedPrices = [];
let extendedPrice = 0;
let subtotal = 0;
let taxAmount = 0;
let shipping = 0;

//Allows access to the url
let params = (new URL(document.location)).searchParams;
        //initializes empty order array
        let order = [];
        //pushes value to array per product
        params.forEach((value,key) => {
            if (key.startsWith('prod')) {
                    order.push(parseInt(value));
                }
        });
        
        
//generates all the item rows
generateItemRows();

// calculate subtotal and tax

 let tax = (subtotal*0.0575);



//checks the shipping price
if(subtotal <= 50)
{
    shipping = 2;
}else if(subtotal <=100)
{
    shipping = 5;
}
else{
    shipping = subtotal*.05;
}

//calculating the total
let total = tax+subtotal+shipping;


//inserts footer row 
document.getElementById("subtotal_cell").innerHTML = "$" + subtotal.toFixed(2);
document.getElementById("tax_cell").innerHTML = "$" + tax.toFixed(2);
document.getElementById("shipping_cell").innerHTML = "$"+shipping.toFixed(2);
document.getElementById("total_cell").innerHTML = "$"+total.toFixed(2);


//function for amount verification; returns a string if the value is not an integer, a negative number, or both.
//empty string if no errors in quantity
function validateQuantity(quantity){
    if(isNaN(quantity)){
        return "Please Enter a Number";
    }else if (quantity<0 && !Number.isInteger(quantity)){
        return "Please Enter a Positive Integer";
    }else if (quantity <0){
        return "Please Enter a Positive Number";
    }else if(!Number.isInteger(quantity)){
        return "Please Enter an Integer";
    }else{
        return"";
    }

}
//generates all the item rows
function generateItemRows(){

    //sets table to the invoice table on the html
    let table = document.getElementById("invoiceTable");

    //checks if it has errors, set false temporarily
    let hasErrors = false; 

    //for each member of the array
    for(let i=0;i<products.length;i++){
        
        //sets item and itemQuantity from the products array, and the array gotten from the url
        let item = products[i];
        let itemQuantity = order[i];
        
        //validate the quantity, we are just kinda looking for if its negative so we dont show it
        let validationMessage = validateQuantity(itemQuantity);
        
        
        //if there is an error, just ignore this 
        if(validationMessage !== ""){
            hasErrors = true;
            let row =table.insertRow();
            row.insertCell(0).insertHTML = item.model;
            row.insertCell(1).innerHTML = validationMessage;
        } 
        //else if, creates the row in the invoice and update the extended price with subtotal
        else if(itemQuantity >0){
            //update the variables
            extendedPrice = item.price * itemQuantity;
            subtotal += extendedPrice;

            //create a new row and with info
            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<img src="${item.image}" class="img-small" name = "img">`;
            row.insertCell(1).innerHTML = item.model;
            row.insertCell(2).innerHTML = itemQuantity;
            row.insertCell(3).innerHTML = "$" + item.price.toFixed(2);
            row.insertCell(4).innerHTML = "$"+extendedPrice.toFixed(2);

        }

    }

}