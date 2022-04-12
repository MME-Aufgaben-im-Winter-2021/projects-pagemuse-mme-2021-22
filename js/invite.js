import AppwriteService from "./appwriteService.js";

function init() {
    let url = new URL(window.location.href);
    let membershipId = url.searchParams.get("membershipId");
    let userId = url.searchParams.get("userId");
    let secret = url.searchParams.get("secret");
    let teamId = url.searchParams.get("teamId");

    AppwriteService.confirmTeamMembership(teamId, membershipId, userId, secret).then(data => {
        console.log(data);
        showSuccessToast("Successfully confirmed team membership!");

        setTimeout(() => {
            AppwriteService.getCurrentSession().then(() => window.location.href = "/home.html", () => window.location.href = "/auth.html")
        }, 5000);

    }, showErrorToast);
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