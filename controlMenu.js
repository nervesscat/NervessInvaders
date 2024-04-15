import CanvasHandler from "./canvasHandler.js";

export default class ControlMenu extends CanvasHandler{
    constructor() {
        super();
    }

    init(){
        this.printControls();;
    }

    printControls(){
        this.ctx.font = '18px W95FA';
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Controls:', this.canvas.width/2, this.canvas.height/2 - 100);
        this.ctx.fillText('Move Left: A', this.canvas.width/2, this.canvas.height/2);
        this.ctx.fillText('Move Right: D', this.canvas.width/2, this.canvas.height/2 + 25);
        this.ctx.fillText('Shoot: Space', this.canvas.width/2, this.canvas.height/2 + 50);
        this.ctx.fillText('Pause: P', this.canvas.width/2, this.canvas.height/2 + 75);
    }
}