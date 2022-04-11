/* eslint-disable */
import AppwriteService from "./appwriteService.js";

var toast;

function init() {
    AppwriteService.getAccount().then(res => {
        console.log(res);

        document.getElementById("usernameInput").value = res.name;
        document.getElementById("emailInput").value = res.email;
    }, err => {
        // User not logged in
        AppwriteService.logout();
    });

    // add event listeners
    document.getElementById("usernameChangeBtn").addEventListener("click", toggleUsername);
    document.getElementById("emailChangeBtn").addEventListener("click", toggleEmail);
    document.getElementById("passwordChangeBtn").addEventListener("click", togglePassword);
    document.getElementById("usernameSaveBtn").addEventListener("click", updateName);
    document.getElementById("emailSaveBtn").addEventListener("click", updateEmail);
    document.getElementById("passwordSaveBtn").addEventListener("click", updatePassword);

    toast = new bootstrap.Toast(document.getElementsByClassName("toast")[0]);
}

function toggleUsername() {
    document.getElementById("usernameInput").toggleAttribute("disabled");
    document.getElementById("usernameSaveBtn").classList.toggle("d-none");
}

function toggleEmail() {
    document.getElementById("emailInput").toggleAttribute("disabled");
    document.getElementById("passwordEmailInput").toggleAttribute("disabled");
    document.getElementById("emailSaveBtn").classList.toggle("d-none");
}

function togglePassword() {
    document.getElementById("oldPasswordInput").toggleAttribute("disabled");
    document.getElementById("newPasswordInput").toggleAttribute("disabled");
    document.getElementById("passwordSaveBtn").classList.toggle("d-none");
}

function updateName() {
    toggleUsername();
    AppwriteService.updateName(document.getElementById("usernameInput").value)
        .then(() => showSuccessToast("Username updated successfully"), showErrorToast);
}

function updateEmail() {
    toggleEmail();
    AppwriteService.updateEmail(document.getElementById("emailInput").value, document.getElementById("passwordEmailInput").value)
        .then(() => showSuccessToast("Email updated successfully"), showErrorToast);
}

function updatePassword() {
    togglePassword();
    AppwriteService.updatePassword(document.getElementById("newPasswordInput").value, document.getElementById("oldPasswordInput").value)
        .then(() => showSuccessToast("Password updated successfully"), showErrorToast);
}

function showErrorToast(err) {
    let toastDiv = document.getElementById("toast-div");
    toastDiv.classList.remove("bg-success");
    toastDiv.classList.add("bg-danger");
    document.getElementById("toast-text").innerHTML = err.message;
    toast.show();
}

function showSuccessToast(message) {
    let toastDiv = document.getElementById("toast-div");
    toastDiv.classList.remove("bg-danger");
    toastDiv.classList.add("bg-success");
    document.getElementById("toast-text").innerHTML = message;
    toast.show();
}

init();