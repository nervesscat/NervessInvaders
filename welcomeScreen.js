import CanvasHandler from './canvasHandler.js';

export default class WelcomeScreen extends CanvasHandler{
    welcomeMessage = 'Game created by Nervesscat';
    disclaimerMessage = 'Open Source Project - You can find the code on GitHub to add it to your website!! www.github.com/nervesscat';
    subtitleMessage = 'Press enter to start the game';
    gameTitle = 'Nervess Attack';

    constructor() {
        super();
    }

    init(){
        this.ctx.font = '18px W95FA';
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.textAlign = 'center';
        this.printWelcomeMessage();
        this.loadImage('./assets/images/game_logo.jpg', this.canvas.width/2 - 128, this.canvas.height/2 - 128, 256, 256);
        this.animateFlickingSubtitle();
    }

    printWelcomeMessage(){
        this.ctx.fillText(this.welcomeMessage, this.canvas.width/2, this.canvas.height - 72);
        this.ctx.fillText(this.disclaimerMessage, this.canvas.width/2, this.canvas.height - 48);
        this.ctx.font = '36px W95FA';
        this.ctx.fillText(this.gameTitle, this.canvas.width/2, this.canvas.height/2 + 180);
    }

    printSubtitleMessage(){
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(this.subtitleMessage, this.canvas.width/2, this.canvas.height - 24);        
    }

    hideSubtitleMessage(){
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 24);
    }

    animateFlickingSubtitle() {
        this.ctx.font = '18px W95FA';
        if (this.stopAnimation) return;
        this.printSubtitleMessage();
        setTimeout(() => {
            this.hideSubtitleMessage();
        }, 1000);
        setTimeout(() => {
            this.animateFlickingSubtitle();
        }, 2000);
    }
}