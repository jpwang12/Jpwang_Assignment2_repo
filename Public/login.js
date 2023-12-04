//login.js
let params = (new URL(document.location)).searchParams;

//when window loads, perform following:
window.onload = function() {
    if (params.has('loginError')) {
        document.getElementById('errorMessage').innerText = params.get('loginError');
        
    }
    document.getElementById('email').value = params.get('email');
}


// Get references to the password input and the show password checkbox
let passwordInput = document.getElementById('password');
let showPasswordCheckbox = document.getElementById('showPasswordCheckbox');

// Add an event listener to the checkbox to toggle password visibility
showPasswordCheckbox.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
});