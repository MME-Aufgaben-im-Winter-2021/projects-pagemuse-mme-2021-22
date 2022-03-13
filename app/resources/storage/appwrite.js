// Init your Web SDK
import { Appwrite } from "appwrite";
const appwrite = new Appwrite();

appwrite
    .setEndpoint('https://appwrite.software-engineering.education/v1') // Your Appwrite Endpoint
    .setProject('6206643994b46f11896b'); // Your project ID

// Register User
appwrite
    .account.create('unique()', 'me@example.com', 'password', 'Jane Doe')
        .then(response => {
            console.log(response);
        }, error => {
            console.log(error);
        });

// Subscribe to files channel
appwrite.subscribe('files', response => {
    if(response.event === 'storage.files.create') {
        // Log when a new file is uploaded
        console.log(response.payload);
    }
});
