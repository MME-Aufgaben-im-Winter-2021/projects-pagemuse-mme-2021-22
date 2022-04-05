import AppwriteService from "./appwriteService.js";


function init() {
    console.log("init pdf viewer");

    let fileId = sessionStorage.getItem("file-id");
    let mimeType = sessionStorage.getItem("mime-type");
    let url = AppwriteService.getFileForView(fileId);

    let div = document.getElementById("objectViewer");
    div.setAttribute("type", mimeType);
    div.setAttribute("data", url.href);

    AppwriteService.getTeams().then(data => {
        data.teams.forEach(team => {
            AppwriteService.getTeamMembers(team.$id).then(members => {
                console.log(members);
            });
        });
    });

    AppwriteService.getDocuments(fileId).then(data => {
        console.log("Documents");
        console.log(data);
    });
}

init();