import AppwriteService from "./appwriteService.js";
// import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

var isRegister = false;
var toast;

function init() {
    AppwriteService.getCurrentSession().then(() => {
        console.log("User already logged in. Forwarding to home");
        window.location.href = "/home.html";
    }, err => {
        console.log("User not logged in!");
    });

    // add event listeners
    document.getElementById("usernameInput").addEventListener("keyup", validateUsername);
    document.getElementById("emailInput").addEventListener("keyup", validateEmail);
    document.getElementById("passwordInput").addEventListener("keyup", validatePassword);
    for (let element of document.getElementsByClassName("link")) {
        element.addEventListener("click", toggleRegistration);
    }
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("registerButton").addEventListener("click", register);

    toast = new bootstrap.Toast(document.getElementsByClassName("toast")[0]);
    console.log("Auth init");
}

/**
 * Tries to open a new user session with the provided email and password. Redirects to /home if successful, displays error message otherwise.
 */
function login() {
    AppwriteService.openSession(document.getElementById("emailInput").value, document.getElementById("passwordInput").value).then(res => {
        console.log("Session succesful", res);
        window.location.href = "/home.html";
    }, err => {
        let passwordInput = document.getElementById("passwordInput");
        passwordInput.classList.remove("is-valid");
        passwordInput.classList.add("is-invalid");
    });
}

/**
 * Tries to register a new user with the provided username, email and password. Redirects to /home if successful, displays error message otherwise.
 */
async function register() {
    AppwriteService.registerUser(document.getElementById("usernameInput").value, document.getElementById("emailInput").value, document.getElementById("passwordInput").value).then(res => {
        window.location.href = "/home.html";
    }, err => {
        document.getElementById("toast-text").innerHTML = err.message;
        toast.show();
    });
}

/**
 * Toggles between Login and Registration by toggling the hidden class for some elements. Checks for validity flag of input fields and displays errors if registering.
 */
function toggleRegistration() {
    for (let element of document.getElementsByClassName("register-toggle"))
        element.classList.toggle("hidden");
    isRegister = !isRegister;

    let emailInput = document.getElementById("emailInput");
    let passwordInput = document.getElementById("passwordInput");

    if (isRegister) {
        if (emailInput.classList.contains("valid"))
            emailInput.classList.add("is-valid");
        else if (emailInput.classList.contains("invalid"))
            emailInput.classList.add("is-invalid");

        if (passwordInput.classList.contains("valid"))
            passwordInput.classList.add("is-valid");
        else if (passwordInput.classList.contains("invalid"))
            passwordInput.classList.add("is-invalid");
    } else {
        emailInput.classList.remove("is-valid", "is-invalid");
        passwordInput.classList.remove("is-valid", "is-invalid");
    }

}

/**
 * Checks if the provided username is valid.
 * 
 * @param {Event} keyupEvent Event from input to validate.
 */
function validateUsername(keyupEvent) {
    if (String(keyupEvent.target.value).length > 0) {
        keyupEvent.target.classList.remove("is-invalid");
        keyupEvent.target.classList.add("is-valid");
    } else {
        keyupEvent.target.classList.remove("is-valid");
        keyupEvent.target.classList.add("is-invalid");
    }
}

/**
 * Checks if the provided email address is valid.
 * https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
 * 
 * @param {Event} keyupEvent Event from input to validate
 */
function validateEmail(keyupEvent) {
    let email = String(keyupEvent.target.value).toLowerCase();
    if (email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    ) {
        keyupEvent.target.classList.remove("invalid");
        keyupEvent.target.classList.add("valid");
    } else if (email.length > 0) {
        keyupEvent.target.classList.remove("valid");
        keyupEvent.target.classList.add("invalid");
    }


    if (!isRegister)
        keyupEvent.target.classList.remove("is-invalid", "is-valid");
    else if (keyupEvent.target.classList.contains("valid")) {
        keyupEvent.target.classList.remove("is-invalid");
        keyupEvent.target.classList.add("is-valid");
    }
    else if (keyupEvent.target.classList.contains("invalid")) {
        keyupEvent.target.classList.remove("is-valid");
        keyupEvent.target.classList.add("is-invalid");
    }
}

/**
 * Checks if the provided password is valid.
 * 
 * @param {Event} keyupEvent Event from input to validate
 */
function validatePassword(keyupEvent) {
    let pwd = String(keyupEvent.target.value);
    if (pwd.length >= 8) {
        keyupEvent.target.classList.remove("invalid");
        keyupEvent.target.classList.add("valid");
    } else if (pwd.length > 0) {
        keyupEvent.target.classList.remove("valid")
        keyupEvent.target.classList.add("invalid");
    }

    if (!isRegister)
        keyupEvent.target.classList.remove("is-invalid", "is-valid");
    else if (keyupEvent.target.classList.contains("valid")) {
        keyupEvent.target.classList.remove("is-invalid");
        keyupEvent.target.classList.add("is-valid");
    }
    else if (keyupEvent.target.classList.contains("invalid")) {
        keyupEvent.target.classList.remove("is-valid");
        keyupEvent.target.classList.add("is-invalid");
    }
}

init();