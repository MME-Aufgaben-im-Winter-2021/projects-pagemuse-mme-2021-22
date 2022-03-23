/*eslint-env browser */
function init() {
	
	//Appwrite
	// eslint-disable-next-line no-undef
	const sdk = new Appwrite(),
	btnLogin = document.getElementById("login"),
	btnRegister = document.getElementById("register"),
	//for PDF viewer
	btnZoom = document.getElementById("zoom"),
	input = document.getElementById("inputFile"),
	openPdf = document.getElementById("openPDF"),
	currentPage = document.getElementById("current_page"),
	viewer = document.querySelector(".pdf-viewer"),
	//for document view and desk view
	btnDocumentView = document.getElementById("btn_documentView"),
	btnDeskView = document.getElementById("btn_deskView"),
	//for comment
	btnCommentIcon = document.getElementById("btn_commentIcon"),
	COMMENT_VIEW_TEMPLATE = document.getElementById("comment-template").innerHTML.trim();
	
	sdk
		.setEndpoint("https://appwrite.software-engineering.education/v1") // Your API Endpoint
		.setProject("6206643994b46f11896b"); // Your project ID
	
	//Login 
	btnLogin.addEventListener("click", () => {
	let promise = sdk.account.createSession(document.getElementById("username").value, document.getElementById("password").value);
	
	promise.then(function (response) {
		console.log(response); // Success
	}, function (error) {
		console.log(error); // Failure
	});
	});
	
	//Create new user
	btnRegister.addEventListener("click", () => {
	let promise2 = sdk.account.create("neu", document.getElementById("registerUsername").value, document.getElementById("registerPassword").value);
	
	promise2.then(function (response) {
		console.log(response); // Success
	}, function (error) {
		console.log(error); // Failure
	});
	});
	
	//Load in Storage via Upload Button Dokumentenansicht
	let promise3 = sdk.storage.createFile("90", document.getElementById("inpFile").files[0]),
		promise4 = sdk.storage.createFile("101", document.getElementById("inputFile").files[0]);
	
	promise3.then(function (response) {
		console.log(response); // Success
	}, function (error) {
		console.log(error); // Failure
	});
	
	//Load in Storage via Upload Button Schreibtisch
	promise4.then(function (response) {
		console.log(response); // Success
	}, function (error) {
		console.log(error); // Failure
	});
	
	//Daten bekommen über derzeit eingeloggte Person
	// eslint-disable-next-line one-var
	let promise = sdk.account.get(name);
	
	promise.then(function (response) {
		console.log(response); // Success
	}, function (error) {
		console.log(error); // Failure
	});
	
// Resource URL
	
		//variable with empty object to store information of current pdf 
		// eslint-disable-next-line one-var
		let currentPDF = {};
	
		//default setting when pdf is opened
		function resetCurrentPDF() {
			currentPDF = {
				file: null,
				countOfPages: 0,
				currentPage: 1,
				zoom: 1.0,
			};
		}
	
		//event listener to open file/pdf when button is clicked
		openPdf.addEventListener("click", () => {
			input.click();
		});
	
		//event listener to toggle to Document View when button is clicked
		btnDocumentView.addEventListener("click", () => {
			document.getElementById("deskView").hidden = true;
			document.getElementById("documentView").hidden = false;
		});
	
		//event listener to toggle to Desk View when button is clicked
		btnDeskView.addEventListener("click", () => {
			document.getElementById("documentView").hidden = true;
			document.getElementById("deskView").hidden = false;
		});
	
		//event listener to open comment section when button is clicked
		btnCommentIcon.addEventListener("click", () => {
			document.getElementById("documentView").hidden = true;
			document.getElementById("deskView").hidden = false;
		});
	
		btnCommentIcon.addEventListener("click", addComment);
	
		function addComment() {
			let el = document.createElement("div");
			el.innerHTML = COMMENT_VIEW_TEMPLATE;
			document.getElementById("commentsection").appendChild(el);
			document.getElementById("textareaComment").disabled = false;
		}
	
		//check if file is pdf file, read content of loaded pdf
		input.addEventListener("change", event => {
			const inputFile = event.target.files[0];
			if (inputFile.type === "application/pdf") {
				const reader = new FileReader();
				reader.readAsDataURL(inputFile);
				reader.onload = () => {
					loadPDF(reader.result);
					btnZoom.disabled = false;
				};
			}
	
		});
	
		//on zoom button clicked pdf rendered
		btnZoom.addEventListener("input", () => {
			if (currentPDF.file) {
				document.getElementById("zoomValue").innerHTML = btnZoom.value + "%";
				currentPDF.zoom = parseInt(btnZoom.value) / 100;
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
	
				let renderContext = {
					canvasContext: context,
					viewport: viewport,
				};
				page.render(renderContext);
			});
			currentPage.innerHTML = currentPDF.currentPage + " of " + currentPDF.countOfPages;
		}
	
	}
	
	init();
	