import { element } from "./utils.js";
import { bus } from "./eventEmitter.js";
import  './uuid.js';


const users = [
    {
        email: "ahmed@gmail.com",
        password: "1234@x4$dfdhgth",
        token: null,
    },
    {
        email: "miri@gmail.com",
        password: "1234@123PASS",
        token: null,
    },
];

export class AuthLogin {
    constructor() {
        this._isAuthed = window.localStorage.getItem("token") ? true : false;
    }
    get isAuthed() {
        return this._isAuthed;
    }
    init(app, login) {
        if (this._isAuthed) {
            app();
        } else {
            login(this.render());
        }
    }

    generateToken() {
        const token = uuidv4();
        window.localStorage.setItem('token', token);
        return token; 
    }

    render() {
        const template = document.createElement("template");
        template.innerHTML = /* html */ `
        <div style="max-width: 700px;margin-top: 20vh;padding: 20px" class="card mr-auto ml-auto">
                <form id="login-form">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input 
                        type="email" 
                        email 
                        required 
                        value="ahmed@gmail.com"
                        name="email"
                        class="form-control" 
                        id="exampleInputEmail1" 
                        aria-describedby="emailHelp">
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input 
                        type="password" 
                        value="1234@x4$dfdhgth"
                        required 
                        name="password"
                        class="form-control" 
                        id="exampleInputPassword1">
                    </div>
                    <button type="submit" id="submit-btn" class="btn btn-primary">Submit</button>
                </form>
        </div>
    `;
        const form = element("#login-form", template.content);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const form = {};

            Object.keys(e.target).forEach((elm) => {
                if (e.target[elm].name && e.target[elm].tagName !== "BUTTON") {
                    form[e.target[elm].name] = e.target[elm].value;
                }
            });
            users.forEach((user) => {
                if (
                    form.email === user.email &&
                    form.password === user.password
                ) {
                    this._isAuthed = true;
                    const token = this.generateToken();
                    user.token = token;
                }
            });

            bus.emit("isAuth", this._isAuthed);
        });
        return template.content;
    }
}
