// https://www.freecodecamp.org/news/reusable-html-components-how-to-reuse-a-header-and-footer-on-a-website/
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import AppwriteService from "./appwriteService.js";

class Sidenav extends HTMLElement {
    tooltips = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                .sidenav {
                    transition: 0.5s;
                    -moz-transition: 0.5s; /* Firefox 4 */
                    -webkit-transition: 0.5s; /* Safari and Chrome */
                    -o-transition: 0.5s; /* Opera */
                    -ms-transition: 0.5s; /* Explorer 10 */
                    //overflow: hidden;
                    width: 11.5rem;
                    transform: translateX(-12.5rem);
                }
                
                .bi {
                    vertical-align: -0.125em;
                    pointer-events: none;
                    fill: currentColor;
                }
                
                .nav-collapse {
                    width: 4.5rem;
                    transform: translateX(-5.5rem);
                }
                
                .nav-flush .nav-link {
                    border-radius: 0;
                }
                
                .nav-toggle {
                    height: 24px;
                    width: 24px;
                }
                
                .nav-toggle:hover {
                    cursor: pointer;
                }
                
                .nav-flush {
                    overflow: hidden;
                }
                
                .dropdown-toggle {
                    outline: 0;
                }

                .dropdown-text {
                    display: block;
                    width: 100%;
                    padding: 0.25rem 1rem;
                }
                
                .content {
                    transition: 0.5s;
                    -moz-transition: 0.5s; /* Firefox 4 */
                    -webkit-transition: 0.5s; /* Safari and Chrome */
                    -o-transition: 0.5s; /* Opera */
                    -ms-transition: 0.5s; /* Explorer 10 */
                }
                
                .content-pd {
                    padding-left: 5.5rem;
                }
                
                .content-pd-extended {
                    padding-left: 12.5rem !important;
                }
            </style>

            <div class="sidenav shadow nav-collapse position-fixed d-flex flex-column flex-shrink-0 bg-light min-vh-100" id="sidenav">
            <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
                <li class="d-flex align-items-center border-bottom">
                    <a href="/home" class="nav-link py-3 px-4" aria-current="page" title="Dokumentenansicht"
                        data-bs-toggle="tooltip" data-bs-placement="right" id="nav-home">
                        <svg class="bi" width="24" height="24" role="img" aria-label="Dokumentenansicht">
                            <use xlink:href="app/img/bootstrap-icons.svg#house-door" />
                        </svg>
                    </a>
                    <span class="px-3">Home</span>
                </li>
                <li class="d-flex align-items-center border-bottom">
                    <a href="/pdfViewer" class="nav-link py-3 px-4" title="Schreibtischansicht" data-bs-toggle="tooltip"
                        data-bs-placement="right" id="nav-pdfViewer">
                        <svg class="bi" width="24" height="24" role="img" aria-label="Editor">
                            <use xlink:href="app/img/bootstrap-icons.svg#pencil-square" />
                        </svg>
                    </a>
                    <span class="px-3">Editor</span>
                </li>
                <li class="d-flex align-items-center border-bottom">
                    <a href="/teams" class="nav-link py-3 px-4" title="Teams" data-bs-toggle="tooltip"
                        data-bs-placement="right" id="nav-teams">
                        <svg class="bi" width="24" height="24" role="img" aria-label="Teams">
                            <use xlink:href="app/img/bootstrap-icons.svg#person-circle" />
                        </svg>
                    </a>
                    <span class="px-3">Teams</span>
                </li>
            <div class="d-flex flex-column">
                <div class="py-3 px-4">
                    <div class="nav-toggle float-end" id="nav-toggle">
                        <svg class="bi" width="24" height="24" role="img" aria-label="Expand" id="nav-toggle-aria">
                            <use xlink:href="app/img/bootstrap-icons.svg#chevron-right" id="nav-toggle-icon" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        `;

        // activate tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            this.tooltips.push(new bootstrap.Tooltip(tooltipTriggerEl))
        });

        // add classes to elements
        document.getElementsByTagName("body")[0].classList.add("content", "content-pd");
        document.getElementById("nav-" + window.location.href.split("/").pop())?.classList.add("active");

        // add event listeners
        document.getElementById("nav-toggle").addEventListener("click", () => this.toggleNavCollapse(this.tooltips));
        document.getElementById("signout-dropdown").addEventListener("click", AppwriteService.logout);

        AppwriteService.getAccount().then(res => {
            document.getElementById("username-dropdown").innerHTML = res.name;
        });
    }

    toggleNavCollapse(tooltips) {
        document.getElementById("sidenav").classList.toggle("nav-collapse");
        document.getElementsByTagName("body")[0].classList.toggle("content-pd-extended");
    
        tooltips.forEach((tooltip) => {
            tooltip.toggleEnabled();
        });
    
        let toggle = document.getElementById("nav-toggle-icon");
        let toggle_aria = document.getElementById("nav-toggle-aria");
        if (toggle.getAttribute("href") === "app/img/bootstrap-icons.svg#chevron-left") {
            toggle.setAttribute("href", "app/img/bootstrap-icons.svg#chevron-right");
            toggle_aria.setAttribute("aria-label", "Collapse");
        }
        else {
            toggle.setAttribute("href", "app/img/bootstrap-icons.svg#chevron-left");
            toggle_aria.setAttribute("aria-label", "Expand");
        }
    }
}

customElements.define('sidenav-component', Sidenav);