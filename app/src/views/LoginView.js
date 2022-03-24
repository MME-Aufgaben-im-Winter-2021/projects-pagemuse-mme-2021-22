import {Event, Observable} from "../utils/Observable.js";

class LoginView extends Observable {

    constructor(el) {
        super();
        this.username = el.querySelector("#username");
        this.password = el.querySelector("#password");
        el.querySelector("button").addEventListener("click", () => this.login());
    }

    login() {
        let username = this.username.value,
        password = this.password.value;
        if(username && password && username !== "" || password !== "") {
            this.notifyAll(new Event("loginAttempt", {
                username: username,
                password: password,
            }));
        }
    }

}

// Creates a single LoginView, representing the corresponding form from index.html (class = login-view)
export default new LoginView(document.querySelector(".login-view"));