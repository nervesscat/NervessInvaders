class CanvasHandler {
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
        let width = window.innerWidth*4/5;
        let height = window.innerHeight*4/5;

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

class WelcomeScreen extends CanvasHandler{
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

class ControllMenu extends CanvasHandler{
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
        this.ctx.fillText('Move Up: W', this.canvas.width/2, this.canvas.height/2 - 50);
        this.ctx.fillText('Move Down: S', this.canvas.width/2, this.canvas.height/2 - 25);
        this.ctx.fillText('Move Left: A', this.canvas.width/2, this.canvas.height/2);
        this.ctx.fillText('Move Right: D', this.canvas.width/2, this.canvas.height/2 + 25);
        this.ctx.fillText('Shoot: Space', this.canvas.width/2, this.canvas.height/2 + 50);
        this.ctx.fillText('Pause: P', this.canvas.width/2, this.canvas.height/2 + 75);
        this.ctx.fillText('Exit: Esc', this.canvas.width/2, this.canvas.height/2 + 100);
    }
}

class GameScreen extends CanvasHandler{
    pixelSize = 64;
    pixel = this.canvas.width/this.pixelSize;

    screenWidth = this.canvas.width/this.pixel;
    screenHeight = this.canvas.height/this.pixel;

    ostMusicSrc = './assets/sounds/NervessInvaders.ogg';

    movePlayer = (e) => {
        if (e.key === 'w') this.movePlayerUp();
        if (e.key === 's') this.movePlayerDown();
        if (e.key === 'a') this.movePlayerLeft();
        if (e.key === 'd') this.movePlayerRight();
        if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd') this.refreshScreen();
    }

    gameStatePosition = {
        player: {x: 16, y: 30},
        enemies: [
            {x: 5, y: 5},
            {x: 15, y: 5},
            {x: 25, y: 5},
            {x: 35, y: 5},
            {x: 45, y: 5},
            {x: 55, y: 5},
            {x: 10, y: 10},
            {x: 20, y: 10},
            {x: 30, y: 10},
            {x: 40, y: 10},
            {x: 50, y: 10},
        ],
    }

    gameSprites = {
        player: [
                    [0,1,0],
                    [1,1,1],
                    [1,0,1],
                ],
        enemy: [
                    [0,1,1,1,0],
                    [1,0,1,0,1],
                    [0,1,1,1,0],
                    [1,0,1,0,1],
                ],
    }

    constructor() {
        super();
        window.addEventListener('keydown', this.movePlayer);
    }

    init(){
        this.printPlayer();
        this.printEnemies();
        this.startGame();
        this.loadSound(this.ostMusicSrc, true, 0.1);
    }

    startGame(){
        this.refreshScreen();
        setInterval(() => {
            this.moveEnemies();
            this.refreshScreen();
        }
        , 1000);
    }

    printPlayer(){
        let x = this.gameStatePosition.player.x;
        let y = this.gameStatePosition.player.y;
        for (let i = 0; i < this.gameSprites.player.length; i++) {
            for (let j = 0; j < this.gameSprites.player[i].length; j++) {
                if (this.gameSprites.player[i][j] === 1) {
                    this.printAPixel(x+j, y+i);
                }
            }
        }
    }

    printEnemies(){
        this.gameStatePosition.enemies.forEach((enemy) => {
            let x = enemy.x;
            let y = enemy.y;
            for (let i = 0; i < this.gameSprites.enemy.length; i++) {
                for (let j = 0; j < this.gameSprites.enemy[i].length; j++) {
                    if (this.gameSprites.enemy[i][j] === 1) {
                        this.printAPixel(x+j, y+i);
                    }
                }
            }
        }
        );
    }

    moveEnemies(){
        this.gameStatePosition.enemies.forEach((enemy) => {
            if (enemy.x >= 60) {
                enemy.x = 0;
                enemy.y = enemy.y + 5;
            }
            enemy.x++;
        });
    }

    movePlayerUp(){
        if (this.gameStatePosition.player.y <= 0) return;
        this.gameStatePosition.player.y--;
    }

    movePlayerDown(){
        if (this.gameStatePosition.player.y >= this.screenHeight - 4) return;
        this.gameStatePosition.player.y++;
    }

    movePlayerLeft(){
        if (this.gameStatePosition.player.x <= 0) return;
        this.gameStatePosition.player.x--;
    }

    movePlayerRight(){
        if (this.gameStatePosition.player.x >= this.screenWidth - 4) return;
        this.gameStatePosition.player.x++;
    }

    refreshScreen(){
        this.setBlackScreen();
        this.printPlayer();
        this.printEnemies();
    }

    setBlackScreen() {
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    printAPixel(x, y){
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.fillRect(x*this.pixel, y*this.pixel, this.pixel, this.pixel);
    }

    loadSound(src, loop = false, volume = 0.5){
        const sound = new Audio(src);
        sound.loop = loop;
        sound.volume = volume;
        sound.play();
    }
}

class Game {
    eventChangeScreen = (e) => {
        if (e.key === 'Enter') this.changeScreen();
    }

    constructor() {
        this.controllMenu = new ControllMenu();
        this.welcomeScreen = new WelcomeScreen();
        this.gameScreen = new GameScreen();
        this.screens = [this.gameScreen, this.welcomeScreen, this.controllMenu];
        this.currentScreen = 0;
        this.init();
        document.addEventListener('keydown', this.eventChangeScreen);
    }

    init() {
        this.screens[this.currentScreen].init();
    }

    async changeScreen() {
        this.screens[this.currentScreen].stopAnimation = true;
        await this.screens[this.currentScreen].changeViewAnimation();
        this.currentScreen++;
        if (this.currentScreen >= this.screens.length) {
            this.currentScreen = 0;
        }
        this.screens[this.currentScreen].init();
    }
}

const game = new Game();

