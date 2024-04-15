export default class CanvasHandler {
    stopAnimation = false;

    constructor(spriteColor = 'green') {
        this.canvas = document.getElementById('game-canvas');
        this.spriteColor = spriteColor;
        this.backgroundColor = 'black';
        this.ctx = this.canvas.getContext('2d');

        this.setCanvasSize();
        this.setBlackScreen();
        this.applyTheFont();
    }

    setCanvasSize(){
        let width = 1080;
        let height = 700;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    setBlackScreen() {
        this.color = this.backgroundColor;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    applyTheFont(){
        this.font = new FontFace('W95FA', 'url(./assets/fonts/PIXELITE.ttf)');
        this.font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
        }).catch((error) => {
            console.error('Failed to load font: ', error);
        });
    }

    createBlackRectangle(height){
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, height);
    }

    loadImage(src, x, y, width = 32, height = 32){
        const image = new Image();
        image.src = src;
        image.onload = () => {
            this.ctx.drawImage(image, x, y, width, height);
        }
    }

    changeViewAnimation() {
        this.stopAnimation = true;
        let height = 0;
        return new Promise(resolve => {
            let interval = setInterval(() => {
                height += 40;
                this.createBlackRectangle(height);
                if (height >= this.canvas.height) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }
}