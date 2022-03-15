/*eslint-env browser */
function init() {
    console.log("### Starting MME Project ###");
    
//variables for pdf viewer
const zoomButton = document.getElementById("zoom"),
    input = document.getElementById("inputFile"),
	openFile = document.getElementById("openPDF"),
	currentPage = document.getElementById("current_page"),
	viewer = document.querySelector(".pdf-viewer");

//variable with empty object to store information of current pdf 
let currentPDF = {};

//default setting when pdf is opened
function resetCurrentPDF() {
	currentPDF = {
		file: null,
		countOfPages: 0,
		currentPage: 1,
		zoom: 1.5,
	};
}

//event listener to open file/pdf when button is clicked
openFile.addEventListener("click", () => {
	input.click();
});

//check if file is pdf file, read content of loaded pdf
input.addEventListener("change", event => {
	const inputFile = event.target.files[0];
	if (inputFile.type === "application/pdf") {
		const reader = new FileReader();
		reader.readAsDataURL(inputFile);
		reader.onload = () => {
			loadPDF(reader.result);
			zoomButton.disabled = false;
		};
	}

});

//on zoom button clicked pdf rendered
zoomButton.addEventListener("input", () => {
	if (currentPDF.file) {
		document.getElementById("zoomValue").innerHTML = zoomButton.value + "%";
		currentPDF.zoom = parseInt(zoomButton.value) / 100;
		renderCurrentPage();
	}
});

//on next button clicked, check if there is next page and next page is shown 
document.getElementById("next").addEventListener("click", () => {
	const isValidPage = currentPDF.currentPage < currentPDF.countOfPages;
	if (isValidPage) {
		currentPDF.currentPage += 1;
		renderCurrentPage();
	}
});

//on previous button clicked, check if there is previous page (in case on first page, there is none) and previous page is shown
document.getElementById("previous").addEventListener("click", () => {
	const isValidPage = currentPDF.currentPage - 1 > 0;
	if (isValidPage) {
		currentPDF.currentPage -= 1;
		renderCurrentPage();
	}
});

//pdf is loaded with default setting
function loadPDF(data) {
	// eslint-disable-next-line no-undef
	const pdfFile = pdfjsLib.getDocument(data);
	resetCurrentPDF();
	//promise gives doc object; set viewer as visible and hide title
	pdfFile.promise.then((doc) => {
		currentPDF.file = doc;
		currentPDF.countOfPages = doc.numPages;
		viewer.classList.remove("hidden");
		document.querySelector("main h3").classList.add("hidden");
		renderCurrentPage();
	});

}

//pdf rendered to viewer, pdf shown

function renderCurrentPage() {
	currentPDF.file.getPage(currentPDF.currentPage).then((page) => {
		var context = viewer.getContext("2d"),
			viewport = page.getViewport({ scale: currentPDF.zoom });
		viewer.height = viewport.height;
		viewer.width = viewport.width;
		// eslint-disable-next-line no-undef
		renderContext = {
			canvasContext: context,
			viewport: viewport,
		};
		// eslint-disable-next-line no-undef
		page.render(renderContext);
	});
	currentPage.innerHTML = currentPDF.currentPage + " of " + currentPDF.countOfPages;
}

}

init();

// Init your Web SDK
// eslint-disable-next-line no-undef
const appwrite = new Appwrite();

appwrite
    .setEndpoint("https://appwrite.software-engineering.education/v1") // Your Appwrite Endpoint
    .setProject("6206643994b46f11896b"); // Your project ID

// Register User
appwrite
    .account.create("unique()", "linh@example.com", "password", "Linh")
        .then(response => {
            console.log(response);
        }, error => {
            console.log(error);
        });

// Subscribe to files channel
appwrite.subscribe("files", response => {
    if(response.event === "storage.files.create") {
        // Log when a new file is uploaded
        console.log(response.payload);
    }
});
