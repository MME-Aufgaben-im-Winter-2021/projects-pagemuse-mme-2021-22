// https://www.freecodecamp.org/news/reusable-html-components-how-to-reuse-a-header-and-footer-on-a-website/
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import AppwriteService from "./appwriteService.js";

class Nav extends HTMLElement {
    tooltips = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `

            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              
              <div class="container-fluid">
                <a class="navbar-brand" href="#">
                  <img src="./app/img/pagemuse.png" alt="" width="100" height="100">
                </a>
                
                
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  
                  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li id="btn_documentView" class="nav-item">
                      <a href="/home" class="nav-link py-3 px-4" aria-current="page" title="Documents"
                        data-bs-toggle="tooltip" data-bs-placement="right" id="nav-home">
                        Dokuments
                      </a>
                    </li>
                    <li id="btn_deskView" class="nav-item">
                      <a href="/pdfViewer" class="nav-link py-3 px-4" title="PDF-Viewer" data-bs-toggle="tooltip"
                        data-bs-placement="right" id="nav-pdfViewer">
                        PDF-Viewer
                      </a>
                    </li>
                    <li id="btn_teams" class="nav-item">
                     <a href="/teams" class="nav-link py-3 px-4" title="Teams" data-bs-toggle="tooltip"
                        data-bs-placement="right" id="nav-teams">
                        Teams
                     </a>
                    </li>
                  </ul>
                  
                </div>
                
                <div class="dropdown">
                  
                    <a href="#" class="align-items-center p-3 link-dark text-decoration-none dropdown-toggle"
                        id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="app/img/person-fill.svg" alt="mdo" width="24" height="24" class="rounded-circle" style="background-color: rgb(236, 176, 65);">
                    </a>
                     <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
                        <li><span class="dropdown-text fw-bolder px-3" id="username-dropdown">Username</span></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                         <li><a class="dropdown-item" href="/profile">My Profile</a></li>
                         <li>
                             <hr class="dropdown-divider">
                         </li>
                         <li><a class="dropdown-item" id="signout-dropdown" href="#">Sign out</a></li>
                     </ul>
                </div>
              

          
              </div>        
            </nav>
            
        `;


        // add classes to elements
        document.getElementsByTagName("body")[0].classList.add("content", "content-pd");
        document.getElementById("nav-" + window.location.href.split("/").pop())?.classList.add("active");

        // add event listeners
        document.getElementById("signout-dropdown").addEventListener("click", AppwriteService.logout);

        AppwriteService.getAccount().then(res => {
            document.getElementById("username-dropdown").innerHTML = res.name;
        });
    }
}

customElements.define('nav-component', Nav);