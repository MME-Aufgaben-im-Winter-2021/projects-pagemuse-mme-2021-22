import AppwriteService from "./appwriteService.js";

var adobeDCView;
var annotationManager;
var profile;
var fileId;
var annotationIds = [];

function init() {
    if (window.AdobeDC) displayPDF();
    else document.addEventListener("adobe_dc_view_sdk.ready", displayPDF);
}

function displayPDF() {
    fileId = sessionStorage.getItem("file-id");
    let fileName = sessionStorage.getItem("file-name");
    console.log(fileName);

    AppwriteService.getAccount().then(data => {
        // set up profile for Adobe PDF API
        profile = {
            userProfile: {
                name: data.name,
                id: data.$id
            }
        }
    }, AppwriteService.logout);

    adobeDCView = new AdobeDC.View({
        clientId: "544cfe77e7ef4117a0505a68e68649a4", //TO-DO: In Adobe muss der Localhost noch angepasst werden
        divId: "adobe-dc-view", // div in which the PDF will be rendered
        downloadWithCredentials: true // download the file with Appwrite session cookie
    });

    // tell Adobe name/id of current user
    adobeDCView.registerCallback(
        AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
        function () {
            return new Promise((resolve, reject) => {
                resolve({
                    code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                    data: profile
                });
            });
        },
        {}
    );

    // load PDF file
    let previewFilePromise = adobeDCView.previewFile({
        content: { location: { url: AppwriteService.getFileForView(fileId).toString() } },
        metaData: { fileName: fileName, id: fileId } // passing id is necessary for annotation API
    }, {
        enableAnnotationAPIs: true
    });

    // get annotation manager
    previewFilePromise.then(adobeViewer => {
        adobeViewer.getAnnotationManager().then(manager => {
            annotationManager = manager;

            // add existing comments
            AppwriteService.getDocuments(fileId).then(data => {
                console.log("Documents");
                console.log(data);

                let list_of_annotations = [];
                data.documents.forEach(document => {
                    let annotation = {
                        "@context": ['https://www.w3.org/ns/anno.jsonld', 'https://comments.acrobat.com/ns/anno.jsonld'],
                        bodyValue: document.bodyValue,
                        created: document.created,
                        creator: {
                            id: document.creatorId,
                            name: document.creatorName,
                            type: 'Person'
                        },
                        id: document.$id,
                        modified: document.modified,
                        motivation: document.motivation,
                        ...document.stylesheetValue && {
                            stylesheet: {
                                type: "CssStylesheet",
                                value: document.stylesheetValue
                            }
                        },
                        target: {
                            source: document.targetSource,
                            selector: JSON.parse(document.targetSelector)
                        },
                        type: "Annotation"
                    };

                    // check if inkList value exists
                    if (document.targetInkList.length) {
                        annotation.target.selector.inkList = [];

                        let start = 0;
                        document.targetInkListLengths.forEach(length => {
                            annotation.target.selector.inkList.push(document.targetInkList.slice(start, start+length));
                            start += length;
                        });
                    }

                    // add annotation to pdf
                    list_of_annotations.push(annotation);
                    // save annotation id, because callback for events will be called and we dont want to duplicate annotations in Appwrite
                    annotationIds.push(document.$id);
                });

                annotationManager.addAnnotations(list_of_annotations).then(() => console.log("Success"), err => console.log("Error"));
            });

            // register callbacks for annotations
            annotationManager.registerEventListener(
                annotationAdded,
                { listenOn: ["ANNOTATION_ADDED"] }
            );

            annotationManager.registerEventListener(
                annotationUpdated,
                { listenOn: ["ANNOTATION_UPDATED"] }
            );

            annotationManager.registerEventListener(
                annotationDeleted,
                { listenOn: ["ANNOTATION_DELETED"] }
            );
        });
    });
}

function annotationAdded(event) {
    console.log(event);

    if (annotationIds.includes(event.data.id))
        return;

    let data = {
        bodyValue: event.data.bodyValue,
        motivation: event.data.motivation,
        targetSource: event.data.target.source,
        creatorId: event.data.creator.id,
        creatorName: event.data.creator.name,
        created: event.data.created,
        modified: event.data.modified,
        stylesheetValue: event.data.stylesheet?.value
    }

    if (event.data.target.selector) {
        // if inkList exists, we have to flatten the array
        if (event.data.target.selector?.inkList) {
            data.targetInkList = [];
            data.targetInkListLengths = [];
            event.data.target.selector.inkList.forEach(list => {
                data.targetInkList.push(... list);
                data.targetInkListLengths.push(list.length);
            });

            // remove inkList from target.selector
            delete event.data.target.selector.inkList;
        }

        // stringify remaining target.selector
        data.targetSelector = JSON.stringify(event.data.target.selector);
    }

    AppwriteService.createDocument(fileId, event.data.id, data).then(res => {
        console.log(res);
    }, err => {
        console.log(err);
    });
}

function annotationUpdated(event) {
    console.log(event);
    let data = {
        bodyValue: event.data.bodyValue,
        motivation: event.data.motivation,
        targetSource: event.data.target.source,
        creatorId: event.data.creator.id,
        creatorName: event.data.creator.name,
        created: event.data.created,
        modified: event.data.modified,
        stylesheetValue: event.data.stylesheet?.value
    }

    if (event.data.target.selector) {
        if (event.data.target.selector?.inkList) {
            data.targetInkList = [];
            data.targetInkListLengths = [];
            event.data.target.selector.inkList.forEach(list => {
                data.targetInkList.push(... list);
                data.targetInkListLengths.push(list.length);
            });

            delete event.data.target.selector.inkList;
        }

        data.targetSelector = JSON.stringify(event.data.target.selector);
    }

    AppwriteService.updateDocument(fileId, event.data.id, data).then(res => {
        console.log(res);
    }, err => {
        console.log(err);
    });
}

function annotationDeleted(event) {
    console.log(event);

    AppwriteService.deleteDocument(fileId, event.data.id).then(res => {
        console.log(res);
    }, err => {
        console.log(err);
    })
}

init();