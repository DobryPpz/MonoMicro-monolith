import { canvas, context, token, clearToken, setUpPage, getCanvasData } from "./script.js";
import { buttonWidth, buttonHeight, clearEverything, drawMenu } from "./scenes.js";

export function getMousePosition(e){
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(e.clientX-rect.left),
        y: Math.round(e.clientY-rect.top)
    };
}

export function logoutEvent(e){
    let position = getMousePosition(e);
    if(position.x >= canvas.width/2-buttonWidth/2 &&
        position.x <= canvas.width/2+buttonWidth/2 &&
        position.y >= canvas.height-2*buttonHeight &&
        position.y <= canvas.height-buttonHeight){
        clearEverything();
        fetch("http://localhost:8000/",{
            method: "GET"
        }).then(response => {
            return response.text()
        })
        .then(data => {
            let doc = new DOMParser().parseFromString(data,"text/html");
            document.body = doc.body;
            clearToken();
            setUpPage();
        });
    }
}

export function scoreEvent(e){
    console.log("chciano wejść do score");
    let position = getMousePosition(e);
    if(position.x >= canvas.width/2-buttonWidth/2 &&
        position.x <= canvas.width/2+buttonWidth/2 &&
        position.y >= 3*canvas.height/4-2*buttonHeight &&
        position.y <= 3*canvas.height/4-buttonHeight){
        clearEverything();
        fetch("http://localhost:8000/score",{
            method: "GET",
            headers: {
                "x-access-token": token
            }
        })
        .then(response => {
            return response.text();
        })
        .then(data => {
            let doc = new DOMParser().parseFromString(data,"text/html");
            document.body = doc.body;
            const scoreTable = document.getElementById("scoretable");
            const menuButton = document.getElementById("menubutton");
            const decreasingButton = document.getElementById("decreasingbutton");
            const playerScoreButton = document.getElementById("playerscorebutton");
            const increasingButton = document.getElementById("increasingbutton");
            menuButton.addEventListener("click",e => {
                clearEverything();
                fetch("http://localhost:8000/menu",{
                    method: "GET",
                    headers: {
                        "x-access-token": token
                    }
                })
                .then(response => {
                    return response.text();
                })
                .then(data => {
                    let doc = new DOMParser().parseFromString(data,"text/html");
                    document.body = doc.body;
                    getCanvasData();
                    drawMenu();
                });
            });
        });
    }
}


