/* eslint-disable */
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

class FileCard extends HTMLElement {
    id;

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="col">
                <div class="card shadow-sm">
                    <img class="card-img-top" width="100%" height="225" id="cardImg" focusable="false">

                    <div class="card-body">
                        <p class="card-text" id="cardText">This is a wider card with supporting text below as a natural lead-in to
                            additional content. This content is a little bit longer.</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group" id="btnGroup">
                                <button type="button" class="btn btn-sm btn-outline-secondary primary-btn" id="primaryButton">View</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary secondary-btn" id="secondaryButton">Edit</button>
                            </div>
                            <small class="text-muted" id="secondaryText"></small>
                            <small class="text-muted" id="timeText"></small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        let text = this.getAttribute("text");
        if (text)
            this.querySelector("#cardText").innerHTML = text;

        let sText = this.getAttribute("secondary-text");
        if (sText)
            this.querySelector("#secondaryText").innerHTML = sText;

        let imgurl = this.getAttribute("imgurl");
        if (imgurl)
            this.querySelector("#cardImg").setAttribute("src", imgurl);

        let time = this.getAttribute("timestamp");
        if (time)
            this.querySelector("#timeText").innerHTML = this.convertTimestampToText(time);

        let pBtn = this.getAttribute("primary-btn");
        let sBtn = this.getAttribute("secondary-btn");
        if (pBtn && sBtn) {
            this.querySelector("#btnGroup").classList.add("btn-group");
            this.querySelector("#primaryButton").innerHtml = pBtn;
            this.querySelector("#secondaryButton").innerHtml = sBtn;
            this.querySelector("#secondaryButton").classList.remove("d-none");
        } else if (pBtn) {
            this.querySelector("#btnGroup").classList.remove("btn-group");
            this.querySelector("#primaryButton").innerHtml = pBtn;
            this.querySelector("#secondaryButton").classList.add("d-none");
        }
    }

    static get observedAttributes() {
        return ["text", "imgurl", "timestamp", "primary-btn", "secondary-btn", "secondary-text"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "text":
                let text = this.querySelector("#cardText");
                if (text) text.innerHTML = newValue;
                break;
            case "imgurl":
                let img = this.querySelector("#cardImg");
                if (img) img.setAttribute("src", newValue);
                break;
            case "timestamp":
                let time = this.querySelector("#timeText");
                if (time) time.innerHTML = this.convertTimestampToText(newValue);
                break;
            case "primary-btn":
                let btn = this.querySelector("#primaryButton");
                if (btn) btn.innerHTML = newValue;
                break;
            case "secondary-btn":
                let sBtn = this.querySelector("#secondaryButton");
                if (sBtn) {
                    if (newValue) {
                        sBtn.innerHtml = newValue;
                        sBtn.classList.remove("d-none");
                        this.querySelector("#btnGroup")?.classList.add("btn-group");
                    } else {
                        sBtn.classList.add("d-none");
                        this.querySelector("#btnGroup")?.classList.remove("btn-group");
                    }
                }
                break;
            case "secondary-text":
                let sText = this.querySelector("#secondaryText");
                if (sText) sText.innerHTML = newValue;
        }
    }

    convertTimestampToText(timestamp) {
        var seconds = Math.floor(((new Date().getTime() / 1000) - timestamp));

        var interval = seconds / 31536000;
        if (interval > 2) {
            return Math.floor(interval) + " years";
        }
        if (interval > 1) {
            return Math.floor(interval) + " years";
        }

        interval = seconds / 2592000;
        if (interval > 2) {
            return Math.floor(interval) + " months";
        }
        if (interval > 1) {
            return Math.floor(interval) + " day";
        }

        interval = seconds / 86400;
        if (interval > 2) {
            return Math.floor(interval) + " days";
        }
        if (interval > 1) {
            return Math.floor(interval) + " day";
        }

        interval = seconds / 3600;
        if (interval > 2) {
            return Math.floor(interval) + " hours";
        }
        if (interval > 1) {
            return Math.floor(interval) + " hour";
        }

        interval = seconds / 60;
        if (interval > 2) {
            return Math.floor(interval) + " minutes";
        }
        if (interval > 1) {
            return Math.floor(interval) + " minute";
        }

        return Math.floor(seconds) + " seconds";
    }
}

customElements.define('file-card', FileCard);