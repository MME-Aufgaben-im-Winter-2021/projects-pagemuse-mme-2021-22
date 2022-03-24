import {Event, Observable} from "../utils/Observable.js";

class RegisterView extends Observable {

    constructor(el) {
        super();
        this.username = el.querySelector("#registerUsername");
        this.email = el.querySelector("#registerEmail");
        this.password = el.querySelector("#registerPassword");
        el.querySelector("button").addEventListener("click", () => this.login());
    }

    login() {
        let username = this.username.value,
        email = this.email.value,
        password = this.password.value;
        if(username && password && email && username !== "" && email !== "" && password !== "") {
            this.notifyAll(new Event("registerAttempt", {
                username: username,
                email: email,
                password: password,
            }));
        }
    }

}

// Creates a single RegisterView, representing the corresponding form from index.html (class = register-view)
export default new RegisterView(document.querySelector(".register-view"));