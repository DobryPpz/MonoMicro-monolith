const signupButton = document.getElementById("signup");
const signinButton = document.getElementById("signin");
const usernameSignup = document.getElementById("usernamesignup");
const passwordSignup = document.getElementById("passwordsignup");
const usernameSignin = document.getElementById("usernamesignin");
const passwordSignin = document.getElementById("passwordsignin");
const message = document.getElementById("message");
export let canvas;
export let context;
let token;

import { drawMenu } from "./scenes.js";

export function getCanvasData(){
    canvas = document.getElementById("canv");
    canvas.width = 800;
    canvas.height = 600;
    context = canvas.getContext("2d");
}

signupButton.addEventListener("click",e => {
    const data = {
        "username": usernameSignup.value,
        "password": passwordSignup.value
    };
    fetch("http://localhost:8000/auth/signup",{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(d => {
        message.innerHTML = d.message;
    });
});

signinButton.addEventListener("click", async e => {
    const data = {
        "username": usernameSignin.value,
        "password": passwordSignin.value
    };
    //console.log(data);
    const res = await fetch("http://localhost:8000/auth/signin",{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
    fetch("http://localhost:8000/menu",{
        method: "GET",
        headers: {
            "x-access-token": res["x-access-token"]
        }
    }).then(response => {
        token = res["x-access-token"];
        return response.text()
    })
    .then(data => {
        let doc = new DOMParser().parseFromString(data,"text/html");
        document.body = doc.body;
        getCanvasData();
        drawMenu();
    });
});