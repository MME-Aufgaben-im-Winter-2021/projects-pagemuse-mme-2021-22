const sdk = new Appwrite();
sdk.setEndpoint("https://appwrite.software-engineering.education/v1").setProject("6206643994b46f11896b");

class AppwriteService {
    openSession(email, password) {
        return sdk.account.createSession(email, password);
    }

    getCurrentSession() {
        return sdk.account.getSession('current');
    }

    getAccount() {
        return sdk.account.get();
    }

    async logout() {
        sdk.account.getSession('current').then(sess => {
            sdk.account.deleteSession(sess.$id).then(resp => {
                window.location.href = "/auth";
            });
        }, err => {
            // user not logged in
            window.location.href = "/auth";
        });
    }

    listFiles() {
        return sdk.storage.listFiles();
    }

    registerUser(username, email, password) {
        return sdk.account.create("unique()", email, password, username);
    }

    updateName(name) {
        return sdk.account.updateName(name);
    }

    updateEmail(email, password) {
        return sdk.account.updateEmail(email, password);
    }

    updatePassword(newPassword, oldPassword) {
        return sdk.account.updatePassword(newPassword, oldPassword);
    }

    getFilePreview(id) {
        return sdk.storage.getFilePreview(id);
    }

    getTeams() {
        return sdk.teams.list();
    }

    createTeam(name) {
        return sdk.teams.create("unique()", name);
    }

    getTeam(id) {
        return sdk.teams.get(id);
    }

    getTeamMembers(id) {
        return sdk.teams.getMemberships(id);
    }

    deleteTeam(id) {
        return sdk.teams.delete(id);
    }

    updateTeamName(id, name) {
        return sdk.teams.update(id, name);
    }

    addMemberToTeam(id, email) {
        // TODO: change redirect URL for prod
        return sdk.teams.createMembership(id, email, [], "http://localhost:3000/invite");
    }

    removeMemberFromTeam(teamID, membershipID) {
        return sdk.teams.deleteMembership(teamID, membershipID);
    }

    confirmTeamMembership(teamId, membershipId, userId, secret) {
        return sdk.teams.updateMembershipStatus(teamId, membershipId, userId, secret);
    }

    uploadFile(file, read, write) {
        return sdk.storage.createFile("unique()", file, read, write);
    }

    getFileMetadata(id) {
        return sdk.storage.getFile(id);
    }

    updateFileRights(id, read, write) {
        return sdk.storage.updateFile(id, read, write);
    }

    getFileForView(id) {
        return sdk.storage.getFileView(id);
    }

    deleteFile(fileId) {
        return sdk.storage.deleteFile(fileId);
    }

    getFileForDownload(id) {
        return sdk.storage.getFileDownload(id);
    }

    getDocuments(id) {
        return sdk.database.listDocuments(id);
    }

    createDocument(collectionId, documentId, data) {
        return sdk.database.createDocument(collectionId, documentId, data);
    }

    deleteDocument(collectionId, documentId) {
        return sdk.database.deleteDocument(collectionId, documentId);
    }

    updateDocument(collectionId, documentId, data) {
        return sdk.database.updateDocument(collectionId, documentId, data);
    }

}

export default new AppwriteService();