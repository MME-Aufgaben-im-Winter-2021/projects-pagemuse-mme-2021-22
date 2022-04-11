/* eslint-disable */
import AppwriteService from "./appwriteService.js";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

var toast,
    modal,
    userID;

function init() {
    // check if user is logged in 
    AppwriteService.getCurrentSession().then(data => {
        console.log(data);
        userID = data.userId;
        console.log("User logged in");
    }, err => {
        console.log("User not logged in!");
        AppwriteService.logout();
    });

    AppwriteService.getTeams().then(data =>
        data.teams.forEach(element => {
            let elem = createTeamCard(element);
            document.getElementById("fileRow").appendChild(elem);
            let buttons = document.getElementById("fileRow").querySelectorAll(".primary-btn");
            buttons[buttons.length - 1].addEventListener("click", () => showTeamDetails(element.$id));
        })
    );

    toast = new bootstrap.Toast(document.getElementsByClassName("toast")[0]);
    modal = new bootstrap.Modal(document.getElementById("teamDetailModal"));
    document.getElementById("newTeamButton").addEventListener("click", createNewTeam);
    document.getElementById("editTeamButton").addEventListener("click", startTeamEdit);
    document.getElementById("closeTeamButton").addEventListener("click", stopTeamEdit);
    document.getElementById("deleteTeamButton").addEventListener("click", deleteTeam);
    document.getElementById("addMemberButton").addEventListener("click", toggleAddMember);
    document.getElementById("confirmMemberMailButton").addEventListener("click", addMember);
}

function createTeamCard(element) {
    let elem = document.createElement("file-card");
    elem.setAttribute("team-id", element.$id);
    elem.setAttribute("timestamp", element.dateCreated);
    elem.setAttribute("text", element.name);
    elem.setAttribute("primary-btn", "View");
    if (element.sum === 1)
        elem.setAttribute("secondary-text", "1 member");
    else
        elem.setAttribute("secondary-text", element.sum + " members");
    elem.setAttribute("member-sum", element.sum);
    return elem;
}

function createNewTeam() {
    AppwriteService.createTeam(document.getElementById("nameInput").value).then((data) => {
        bootstrap.Modal.getInstance(document.getElementById("newTeamModal")).hide();
        let elem = createTeamCard(data);
        document.getElementById("fileRow").appendChild(elem);
        let buttons = document.getElementById("fileRow").querySelectorAll(".primary-btn");
        buttons[buttons.length - 1].addEventListener("click", () => showTeamDetails(data.$id));

        showSuccessToast("Created new team!");
    }, showErrorToast);

    document.getElementById("nameInput").value = "";
}

function showTeamDetails(id) {
    let modalElem = document.getElementById("teamDetailModal");
    modalElem.setAttribute("team-id", id);

    // set name of team in modal
    AppwriteService.getTeam(id).then(data => {
        modalElem.querySelector("#detailNameLabel").innerHTML = data.name;
        modalElem.setAttribute("team-name", data.name);
    }, err => {
        showErrorToast(err);
        return;
    });

    AppwriteService.getTeamMembers(id).then(data => {
        console.log(data);
        let list = modalElem.querySelector("#memberList")

        // reusing old modal -> need to remove old members
        list.replaceChildren();

        // add member to list
        data.memberships.forEach(member => {
            let template = document.getElementById("teamMemberTemplate");
            template.content.querySelector("#memberItem").setAttribute("membership-id", member.$id);
            template.content.querySelector("#memberName").innerHTML = member.name;

            // show owner icon, if member is owner
            if (member.roles.includes("owner")) {
                template.content.querySelector("#ownerIcon").classList.remove("d-none");
                template.content.querySelector("#trashIcon").setAttribute("is-owner", "true");

                // check if current user is owner
                if (member.userId === userID) {
                    document.getElementById("editTeamButton").classList.remove("d-none");
                    document.getElementById("addMemberButton").classList.remove("d-none");
                }
            } else {
                template.content.querySelector("#ownerIcon").classList.add("d-none");
                template.content.querySelector("#trashIcon").setAttribute("is-owner", "false");
            }

            if (!member.confirm)
                template.content.querySelector("#confirmationBadge").classList.remove("d-none");
            else
                template.content.querySelector("#confirmationBadge").classList.add("d-none");

            if (member.userId === userID)
                template.content.querySelector("#leaveIcon").classList.remove("d-none");
            else
                template.content.querySelector("#leaveIcon").classList.add("d-none");

            let elem = document.importNode(template.content, true);
            elem.querySelector("#trashIcon").addEventListener("click", deleteMember);
            elem.querySelector("#leaveIcon").addEventListener("click", leaveTeam);
            list.appendChild(elem);
        });

        // initialize tooltip for owner icon
        let ttList = [].slice.call(document.querySelectorAll("#ownerIcon:not(.d-none), #trashIcon, #leaveIcon"));
        ttList.forEach((ttElem) => {
            new bootstrap.Tooltip(ttElem);
        });

        modal.show();
    }, showErrorToast);
}

function startTeamEdit(event) {
    let modalElem = document.getElementById("teamDetailModal"),
        id = modalElem.getAttribute("team-id"),
        name = modalElem.getAttribute("team-name"),
        nameInput = document.getElementById("nameDetailInput"),
        nameLabel = document.getElementById("detailNameLabel");

    if (event.target.innerHTML === "Edit") {
        console.log("Start editing");
        event.target.innerHTML = "Save";
        document.getElementById("closeTeamButton").innerHTML = "Cancel";
        document.getElementById("deleteTeamButton").classList.remove("d-none");
        document.getElementById("addMemberButton").classList.add("d-none");

        nameLabel.classList.add("d-none");
        nameInput.value = name;
        nameInput.classList.remove("d-none");
        document.getElementById("emailDiv").classList.add("d-none");

        let icons = [].slice.call(document.querySelectorAll('#trashIcon[is-owner="false"]'));
        icons.forEach(icon => icon.classList.remove("d-none"));
    } else {
        console.log("Save editing");
        event.target.innerHTML = "Edit";
        document.getElementById("closeTeamButton").innerHTML = "Close";
        document.getElementById("deleteTeamButton").classList.add("d-none");
        document.getElementById("addMemberButton").classList.remove("d-none");

        let icons = [].slice.call(document.querySelectorAll('#trashIcon[is-owner="false"]'));
        icons.forEach(icon => icon.classList.add("d-none"));

        if (nameInput.value != name) {
            AppwriteService.updateTeamName(id, nameInput.value).then(data => {
                nameLabel.innerHTML = nameInput.value;
                document.querySelector('file-card[team-id="' + id + '"]').setAttribute("text", nameInput.value);
                showSuccessToast("Successfully changed team name!");
            }, showErrorToast);
        }
        document.getElementById("detailNameLabel").classList.remove("d-none");
        document.getElementById("nameDetailInput").classList.add("d-none");
    }

    console.log(id);
}

function stopTeamEdit(event) {
    document.getElementById("deleteTeamButton").classList.add("d-none");
    document.getElementById("editTeamButton").innerHTML = "Edit";
    let icons = [].slice.call(document.querySelectorAll('#trashIcon[is-owner="false"]'));
    icons.forEach(icon => icon.classList.add("d-none"));

    if (event.target.innerHTML === "Cancel") {
        // currently in editing mode, stop mode but still show modal
        event.target.innerHTML = "Close";
        // TODO: remove buttons for team members
        document.getElementById("detailNameLabel").classList.remove("d-none");
        document.getElementById("nameDetailInput").classList.add("d-none");
        document.getElementById("addMemberButton").classList.remove("d-none");
    } else {
        document.getElementById("editTeamButton").classList.add("d-none");
        document.getElementById("addMemberButton").classList.add("d-none");
        document.getElementById("emailDiv").classList.add("d-none");
        // close modal
        modal.hide();
    }
}

function leaveTeam(event) {
    console.log("leave team");
    let membershipID = event.target.closest("li").getAttribute("membership-id"),
        teamID = document.getElementById("teamDetailModal").getAttribute("team-id");
    AppwriteService.removeMemberFromTeam(teamID, membershipID).then(data => {
        console.log(data);
    }, showErrorToast);
}

function deleteTeam() {
    let id = document.getElementById("teamDetailModal").getAttribute("team-id"),
        card = document.querySelector('file-card[team-id="' + id + '"]');
    console.log(card);

    AppwriteService.deleteTeam(id).then(res => {
        console.log(res);
        document.getElementById("deleteTeamButton").classList.add("d-none");
        document.getElementById("editTeamButton").innerHTML = "Edit";
        document.getElementById("editTeamButton").classList.add("d-none");
        document.getElementById("closeTeamButton").innerHTML = "Close";
        document.getElementById("detailNameLabel").classList.remove("d-none");
        document.getElementById("nameDetailInput").classList.add("d-none");
        document.getElementById("addMemberButton").classList.add("d-none");
        card.remove();
        modal.hide();
        showSuccessToast("Successfully deleted team!");
    }, showErrorToast);
}

function toggleAddMember() {
    let modalElem = document.getElementById("teamDetailModal"),
        id = modalElem.getAttribute("team-id");
    document.getElementById("emailDiv").classList.toggle("d-none");
}

function addMember() {
    let email = document.getElementById("memberEmailInput").value,
        id = document.getElementById("teamDetailModal").getAttribute("team-id"),
        modalElement = document.getElementById("teamDetailModal"),
        list = modalElement.querySelector("#memberList");

    AppwriteService.addMemberToTeam(id, email).then(res => {
        console.log(res);

        let template = document.getElementById("teamMemberTemplate");
        template.content.querySelector("#memberName").innerHTML = res.name;

        // show owner icon, if member is owner
        if (res.roles.includes("owner")) {
            template.content.querySelector("#ownerIcon").classList.remove("d-none");

            // check if current user is owner
            if (res.userId == userID) {
                document.getElementById("editTeamButton").classList.remove("d-none");
                document.getElementById("addMemberButton").classList.remove("d-none");
            }
        } else {
            template.content.querySelector("#ownerIcon").classList.add("d-none");
        }
        list.appendChild(document.importNode(template.content, true));

        // initialize tooltip for owner icon
        let ttList = [].slice.call(document.querySelectorAll("#ownerIcon:not(.d-none)"));
        ttList.forEach((ttElem) => {
            new bootstrap.Tooltip(ttElem);
        });

        showSuccessToast("Successfully added member!");
    }, showErrorToast);
}

function deleteMember(event) {
    let elem = event.target.closest("li"),
        memberID = elem.getAttribute("membership-id"),
        teamID = document.getElementById("teamDetailModal").getAttribute("team-id");
    AppwriteService.removeMemberFromTeam(teamID, memberID).then(data => {
        console.log(data);
        elem.remove();
        let badge = event.target.closest("#actionButtons").querySelector("#confirmationBadge");
        if (badge.classList.contains("d-none")) {
            let card = document.querySelector("file-card[team-id=\"" + teamID + '"]'),
                newCount = parseInt(card.getAttribute("member-sum")) -1;
            if (newCount === 1)
                card.setAttribute("secondary-text", "1 member");
            else
                card.setAttribute("secondary-text", newCount + " members");
            card.setAttribute("member.sum", newCount);
        }
        showSuccessToast("Successfully removed member from team!");
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