import { canvas, context } from "./script.js";

export function drawMenu(){
    let graj = new Image();
    graj.src = "button.png";
    graj.onload = () => {context.drawImage(graj,canvas.width/2-(graj.width*0.4)/2,200,graj.width*0.4,graj.height*0.4);};
}

