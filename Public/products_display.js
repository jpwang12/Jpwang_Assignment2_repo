//params for url, error, and order
let params = (new URL(document.location)).searchParams;
let error;
let order = [];

//get if there was an error before
error = params.get('error');

//fill order array with item ammounts from previous attempts
params.forEach((value,key) => {
    if (key.startsWith('prod')) {
            order.push(parseInt(value));
        }
});

//if there is an error, show the error above text 
if(error == 'true'){
    
    document.getElementById('errorDiv').innerHTML += `<h2 class="text-danger">Input Error - Please Fix!</h2><br>`;
}

/*
For each item in the selection:
    Model the image by placing it above
    Enter the model's title, price, availability, and total sold in the model body located in products[i].

   Make an input with a placeholder value of 0 so that when entered, it validates the quantity.
        If the order array for that slot contains anything other than 0 or undefined, the initial value shown in the box can be filled in.
    Make a space for errors to be defined.
    Execute the validation process to add errors in case the initial value is accepted.
*/
for (let i = 0; i < products.length; i++) {
    document.querySelector('.row').innerHTML += 
        `<div class="col-md-6 product_model mb-4">
        <div class="model">
            <div class="text-center">
                <img src="${products[i].image}" class="model-img-top border-top" alt="Product Image">
            </div>
            <div class="model-body">
                <h5 class="model-title">${products[i].model}</h5>
                <p class="model-text">
                    Price: $${(products[i].price).toFixed(2)}<br>
                    Available: ${products[i].qty_available}<br>
                    Total Sold: ${products[i].total_sold}
                </p>
                
                <input type="text" placeholder="0" name="quantity_textbox" id="${[i]}" class="form-control mb-2" oninput="validateQuantity(this)" value="${order[i] !== 0 && order[i] !== undefined ? order[i] : ''}" onload="validateQuantity(this)">
                <p id="invalidQuantity${[i]}" class="text-danger"></p>
                </div>
            </div>
        </div>`
        validateQuantity(document.getElementById(`${[i]}`));
 ;}

//generate validation message
    function validateQuantity(quantity){
        //Determine the variables, then take the number from the quantity and assign it to a number.
        let valMessage = '';
        let quantityNumber = Number(quantity.value);
        //console.log(Number.isInteger(quantityNumber));
        document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = "validationMessage";
        //console.log(products[quantity.id]['qty_available']);
        //obtains a message of validation if it's negative, not an integer, not a number, or there aren't enough things in inventory
        //else empty string 
        if(isNaN(quantityNumber)){
            valMessage = "Please enter valid number";
        }else if (quantityNumber<0 && !Number.isInteger(quantityNumber)){
            valMessage = "Please enter a Positive Integer";
        }else if (quantityNumber <0){
            valMessage = "Please enter a Positive Value";
        }else if(!Number.isInteger(quantityNumber)){
            valMessage = "Please enter an Integer";
        }else if(quantityNumber > products[quantity.id]['qty_available']){
            valMessage = "Not enough items in Stock!";
        }
        else{
            valMessage = '';
        }
        //set valMessage to the innerHTML to the section
        document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = valMessage;
        //console.log(products[quantity.id])
    } 