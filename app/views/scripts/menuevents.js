import { canvas, context, token } from "./script.js";
import { buttonWidth, buttonHeight, clearEverything } from "./scenes.js";

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
            token = "";
        });
    }
}