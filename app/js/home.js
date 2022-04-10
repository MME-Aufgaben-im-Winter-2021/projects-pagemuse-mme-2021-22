import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import AppwriteService from "./appwriteService.js";

var sess;
var toast;
var newFileModal;

function init() {
    // check if user is logged in
    AppwriteService.getCurrentSession().then(data => {
        sess = data;
    }, err => {
        console.log("User not logged in!");
        AppwriteService.logout()
    });

    // get files of user
    AppwriteService.listFiles().then(data => {
        console.log(data);
        let container = document.getElementById("fileRow");

        // create new card for each file
        data.files.forEach(element => {
            let elem = document.createElement("file-card");
            elem.setAttribute("file-id", element.$id);
            elem.setAttribute("mime-type", element.mimeType);
            elem.setAttribute("timestamp", element.dateCreated);
            elem.setAttribute("imgurl", AppwriteService.getFilePreview(element.$id));
            elem.setAttribute("text", element.name);
            elem.setAttribute("primary-btn", "View");
            elem.setAttribute("secondary-btn", "Edit");
            container.appendChild(elem);
        });

        [].slice.call(document.querySelectorAll("#primaryButton")).forEach(btn => btn.addEventListener("click", viewFile));
        [].slice.call(document.querySelectorAll("#secondaryButton")).forEach(btn => btn.addEventListener("click", openModal));
    });

    toast = new bootstrap.Toast(document.getElementsByClassName("toast")[0]);
    newFileModal = new bootstrap.Modal(document.getElementById("newFileModal"));
    document.getElementById("newFileButton").addEventListener("click", openModal);
    document.getElementById("uploadButton").addEventListener("click", uploadFile);
    document.getElementById("deleteButton").addEventListener("click", deleteFile);
    console.log("Home init");
}

function viewFile(event) {
    let fileCard = event.target.closest("file-card");
    let mimeType = fileCard.getAttribute("mime-type");
    let fileId = fileCard.getAttribute("file-id");
    let fileName = fileCard.getAttribute("text");
    console.log(mimeType, fileId);

    sessionStorage.setItem("file-id", fileId);
    sessionStorage.setItem("mime-type", mimeType);
    sessionStorage.setItem("file-name", fileName);
    window.location.href = "/pdfViewer";
}

function openModal(event) {
    let read = [], write = [];
    let uBtn = document.getElementById("uploadButton");

    if (event.target.id == "secondaryButton") {
        let fileCard = event.target.closest("file-card");
        let fileId = event.target.closest("file-card").getAttribute("file-id");

        // modal was opened by pressing the edit button on existing file --> get file read/write list
        AppwriteService.getFileMetadata(fileId).then(data => {
            read = data.$read;
            write = data.$write;
        }, (err) => {
            showErrorToast(err);
            return;
        });
        // change modal title to filename
        document.getElementById("staticBackdropLabel").innerHTML = fileCard.getAttribute("text");
        // change button text to Save
        uBtn.innerHTML = "Save";
        // hide save button temporarily
        uBtn.classList.add("d-none");
        uBtn.setAttribute("file-id", fileId);
        document.getElementById("deleteButton").setAttribute("file-id", fileId);
        // hide file selection div
        document.getElementById("fileDiv").classList.add("d-none");
    } else {
        // modal was opened to upload a new file
        // change modal title
        document.getElementById("staticBackdropLabel").innerHTML = "Upload new file";
        // change button text to Upload
        uBtn.innerHTML = "Upload";
        // make upload button visible
        uBtn.classList.remove("d-none");
        uBtn.removeAttribute("file-id");
        // show file selection div
        document.getElementById("fileDiv").classList.remove("d-none");
        // hide delete button
        document.getElementById("deleteButton").classList.add("d-none");
    }

    AppwriteService.getTeams().then(data => {
        let list = document.getElementById("teamList");
        // remove all previous teams
        list.replaceChildren();

        // add list header
        let header = document.getElementById("rightsHeader");
        list.appendChild(document.importNode(header.content, true));

        // save if current user is allowed to update file details, in case hes not uploading a new file
        let hasWriteAccess = false;

        // iterate over all teams, current user is a member of
        data.teams.forEach(team => {
            // create new node and set all info
            let template = document.getElementById("teamRightsTemplate");
            template.content.querySelector("#teamName").innerHTML = team.name;
            template.content.querySelector("#teamRow").setAttribute("team-id", team.$id);
            let elem = document.importNode(template.content, true);
            list.appendChild(elem);

            // check for rights of the teams
            if (read.includes("team:" + team.$id))
                [].slice.call(document.querySelectorAll("#readPermissionSwitch")).pop().checked = true;
            if (write.includes("team:" + team.$id)) {
                [].slice.call(document.querySelectorAll("#writePermissionSwitch")).pop().checked = true;
                hasWriteAccess = true;
            }
        });

        if (hasWriteAccess) {
            // unhide upload button if current user has write access
            document.getElementById("uploadButton").classList.remove("d-none");
            // show delete button
            document.getElementById("deleteButton").classList.remove("d-none");
        }
        else if (event.target.id == "secondaryButton") {
            // hide upload button and disable switches if modal was opened via edit button and current user does not have write access
            document.getElementById("uploadButton").classList.add("d-none");
            [].slice.call(document.querySelectorAll("form-check-input")).forEach(input => input.setAttribute("disabled", ""));
            // hide delete button
            document.getElementById("deleteButton").classList.add("d-none");
        }

    }, showErrorToast);

    newFileModal.show();
}

function uploadFile(event) {
    console.log("upload");

    let read = [];
    let write = [];
    let teams = [].slice.call(document.querySelectorAll("#teamRow"));
    // iterate over all teams
    teams.forEach(team => {
        console.log(team);
        let id = "team:" + team.getAttribute("team-id");
        // add id to respective arrs, if permission is granted
        if (team.querySelector("#readPermissionSwitch").checked)
            read.push(id);
        if (team.querySelector("#writePermissionSwitch").checked)
            write.push(id);
    });

    let fileId = event.target.getAttribute("file-id");
    if (fileId) {
        // function was triggered while modifying existing file rights --> update rights on appwrite
        AppwriteService.updateFileRights(fileId, read, write).then(data => {
            console.log(data);
            showSuccessToast("Successfully updated file access rights");
            newFileModal.hide();
        }, showErrorToast);
    } else {
        // function was triggered to upload a new file

        // check if file to upload was selected
        let fileInput = document.getElementById("fileInput");
        let file = fileInput.files[0];
        if (file) {
            fileInput.classList.remove("is-invalid");
            fileInput.classList.add("is-valid");
        } else {
            fileInput.classList.remove("is-valid");
            fileInput.classList.add("is-invalid");
            return;
        }

        // upload File to Appwrite
        AppwriteService.uploadFile(file, read, write).then(data => {
            // add new file to UI
            let elem = document.createElement("file-card");
            elem.setAttribute("file-id", data.$id);
            elem.setAttribute("mime-type", data.mimeType);
            elem.setAttribute("timestamp", data.dateCreated);
            elem.setAttribute("imgurl", AppwriteService.getFilePreview(data.$id));
            elem.setAttribute("text", data.name);
            elem.setAttribute("primary-btn", "View");
            elem.setAttribute("secondary-btn", "Edit");
            document.getElementById("fileRow").appendChild(elem);
            [].slice.call(document.querySelectorAll("#primaryButton")).pop().addEventListener("click", viewFile);
            [].slice.call(document.querySelectorAll("#secondaryButton")).pop().addEventListener("click", openModal);

            showSuccessToast("Successfully uploaded file!");
            newFileModal.hide();
        }, showErrorToast);
    }
}

function deleteFile(event) {
    let fileId = event.target.getAttribute("file-id");
    let card = document.querySelector('file-card[file-id="' + fileId + '"]');

    AppwriteService.deleteFile(event.target.getAttribute("file-id")).then(ret => {
        card.remove();        
        showSuccessToast("Successfully deleted file!");
        newFileModal.hide();
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