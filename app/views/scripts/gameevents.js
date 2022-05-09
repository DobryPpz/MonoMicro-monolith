import { canvas, context, token, getCanvasData, socket} from "./script.js";
import { drawMenu, buttonWidth, buttonHeight, clearEverything } from "./scenes.js";
import { getMousePosition } from "./menuevents.js";

function shootEvent(e){

}

function rotateEvent(e){
    
}

function moveEvent(e){
    
}

function exitEvent(e){
    
}

function clearEvents(){
    canvas.removeEventListener("click",shootEvent);
    canvas.removeEventListener("mousemove",rotateEvent);
    window.removeEventListener("keydown",moveEvent);
    window.removeEventListener("keydown",exitEvent);
}

export async function gameEvent(e){
    let position = getMousePosition(e);
    if(position.x >= canvas.width/2-buttonWidth/2 &&
        position.x <= canvas.width/2+buttonWidth/2 &&
        position.y >= canvas.height/4-2*buttonHeight &&
        position.y <= canvas.height/4-buttonHeight){
        clearEverything();
        getCanvasData();
        console.log("jesteśmy w grze");
        canvas.style.backgroundColor = "black";
        await fetch("http://localhost:8000/game",{
            method: "POST",
            headers: {
                "x-access-token": token,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "socketid": socket.id
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        });
        socket.on("room-ready", roomId => {
            socket.emit("join-room",roomId);
        });
        socket.on("end-game", roomId => {
            socket.emit("leave-room",roomId);
        });
        socket.on("update", data => {
            
        });
    }
}