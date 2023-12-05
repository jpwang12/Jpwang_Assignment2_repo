//login.js
let params = (new URL(document.location)).searchParams;

//when window loads, perform following:
window.onload = function() {
    if (params.has('loginError')) {
        document.getElementById('errorMessage').innerText = params.get('loginError');
        
    }
    document.getElementById('email').value = params.get('email');
}


// password reference and checkbox 
let passwordInput = document.getElementById('password');
let showPasswordCheckbox = document.getElementById('showPasswordCheckbox');

// check box to look at visibility 
showPasswordCheckbox.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
});