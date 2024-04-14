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
        this.ctx.fillText('Move Left: A', this.canvas.width/2, this.canvas.height/2);
        this.ctx.fillText('Move Right: D', this.canvas.width/2, this.canvas.height/2 + 25);
        this.ctx.fillText('Shoot: Space', this.canvas.width/2, this.canvas.height/2 + 50);
        this.ctx.fillText('Pause: P', this.canvas.width/2, this.canvas.height/2 + 75);
    }
}

class Bullet {
    sprite = [
        [1],
        [1],
    ]

    velocity = 1;

    constructor(x, y, direction = 1) {
        this.x = x;
        this.y = y;
        this.velocity *= direction;
        this.createVertex();
        this.moveBullet();
    }

    createVertex(){
        this.vertex = [
            [this.x, this.y],
            [this.x + 1, this.y],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1],
        ]
    }

    moveBullet(){
        setInterval(() => {
            this.y -= this.velocity;
            this.createVertex();
        }, 100);
    }

    destroyBullet(){
        this.x = -10;
        this.y = -10;
        this.velocity = 0;
        this.vertex = [];
    }
}

class Enemy {
    enemy = [
        [0,1,1,1,0],
        [1,0,1,0,1],
        [0,1,1,1,0],
        [1,0,1,0,1],
    ]

    destroy = [
        [
            [0,1,0],
            [1,0,1],
            [0,1,0],
        ], 
        [
            [1,0,1],
            [0,0,0],
            [1,0,1],
        ],
    ]

    velocity = 0.5;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.createVertex();
    }

    createVertex(){
        this.vertex = [
            [this.x, this.y],
            [this.x + 5, this.y],
            [this.x, this.y + 3],
            [this.x + 5, this.y + 3],
        ]
    }

    moveEnemy(){
        if (this.x >= 60) {
            this.x = 0;
            this.y = this.y + 5;
        }
        this.x += this.velocity;
        this.createVertex();
    }

    async destroyEnemy(){
        await this.destroyAnimaton();
        this.x = -10;
        this.y = -10;
        this.velocity = 0;
        this.createVertex();   
    }

    destroyAnimaton(){
        return new Promise(resolve => {
            let i = 0;
            let interval = setInterval(() => {
                this.enemy = this.destroy[i%2];
                i++;
                if (i >= 4) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }
}

class Player {
    sprite = [
        [1,0,1],
        [1,1,1],
        [1,1,1],
    ]

    constructor(x, y, screenHeight, screenWidth) {
        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;
        this.x = x;
        this.y = y;
        this.createVertex();
    }

    createVertex(){
        this.vertex = [
            [this.x, this.y],
            [this.x + 2, this.y],
            [this.x, this.y + 2],
            [this.x + 2, this.y + 2],
        ]
    }

    movePlayerUp(){
        if (this.y <= 0) return;
        this.y--;
        this.createVertex();
    }

    movePlayerDown(){
        if (this.y >= this.screenHeight - 4) return;
        this.y++;
        this.createVertex();
    }

    movePlayerLeft(){
        if (this.x <= 0) return;
        this.x--;
        this.createVertex();
    }

    movePlayerRight(){
        if (this.x >= this.screenWidth - 4) return;
        this.x++;
        this.createVertex();
    }

}

class GameScreen extends CanvasHandler{
    pixelSize = 70;
    pixel = this.canvas.width/this.pixelSize;

    screenWidth = this.canvas.width/this.pixel;
    screenHeight = this.canvas.height/this.pixel;

    UPPER_LIMIT = 30;

    ostMusicSrc = './assets/sounds/NervessInvaders.ogg';
    bulletSound = './assets/sounds/NervessInvadersShot.ogg'
    
    TOTAL_ALIENS = 11;

    gameSprites = {
        player: new Player(33, 38, this.screenHeight, this.screenWidth),
        enemies: [
            new Enemy(5, 5),
            new Enemy(15, 5),
            new Enemy(25, 5),
            new Enemy(35, 5),
            new Enemy(45, 5),
            new Enemy(55, 5),
            new Enemy(10, 10),
            new Enemy(20, 10),
            new Enemy(30, 10),
            new Enemy(40, 10),
            new Enemy(50, 10),
        ],
        bullets: [],
    }

    constructor() {
        super();
    }

    movePlayer = (e) => {
        if (e.key === 'p') { 
            this.pauseGame();
            this.refreshScreen();
            return;
        }
        if (this.stopAnimation) return;
        if (e.key === 'a' || e.key === 'ArrowLeft') this.gameSprites.player.movePlayerLeft();
        if (e.key === 'd' || e.key === 'ArrowRight') this.gameSprites.player.movePlayerRight();
        if (e.key === ' ') this.shootBullet();
        if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') this.refreshScreen();
    }

    init(){
        this.refreshScreen();
        this.startGame();
        this.loadSound(this.ostMusicSrc, true, 0.5);
        window.addEventListener('keydown', this.movePlayer);
    }

    startGame(){
        let intervalId = setInterval(() => {
            if (this.stopAnimation) {
                clearInterval(intervalId);
                return;
            }
            this.moveEnemies();
            this.enemyShoot();
            this.refreshScreen();
        }, 100);
    }

    pauseGame(){
        this.stopAnimation = !this.stopAnimation;
        console.log(this.stopAnimation);
        if (!this.stopAnimation) {
            this.startGame();
        } else {
            this.showPauseScreen();
        }
    }

    showPauseScreen(){
        this.ctx.font = '36px W95FA';
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Paused', this.canvas.width/2, this.canvas.height/2);
    }

    shootBullet(){
        this.gameSprites.bullets.push(new Bullet(this.gameSprites.player.x+1, this.gameSprites.player.y-2, 1));
        this.loadSound(this.bulletSound, false, 0.8)
    }

    printPlayer(){
        let x = this.gameSprites.player.x;
        let y = this.gameSprites.player.y;
        for (let i = 0; i < this.gameSprites.player.sprite.length; i++) { 
            for (let j = 0; j < this.gameSprites.player.sprite[i].length; j++) {
                if (this.gameSprites.player.sprite[i][j] === 1) {
                    this.drawPixel(x+j, y+i);
                }
            }
        }
    }

    printEnemies(){
        this.gameSprites.enemies.forEach((enemy) => {
            for (let i = 0; i < enemy.enemy.length; i++) {
                for (let j = 0; j < enemy.enemy[i].length; j++) {
                    if (enemy.enemy[i][j] === 1) {
                        this.drawPixel(enemy.x+j, enemy.y+i);
                    }
                }
            }
        });
    }

    printBullets(){
        this.gameSprites.bullets.forEach((bullet, index) => {
            this.deleteBulletIfItLeftTheScreen(bullet, index);
            for (let i = 0; i < bullet.sprite.length; i++) {
                for (let j = 0; j < bullet.sprite[i].length; j++) {
                    if (bullet.sprite[i][j] === 1) {
                        this.drawPixel(bullet.x+j, bullet.y+i);
                    }
                }
            }
        });
    }

    deleteBulletIfItLeftTheScreen(bullet, index){
        if (bullet.vertex[3][1] < 0){
            this.gameSprites.bullets.splice(index, 1)
        }
    }

    moveEnemies(){
        this.gameSprites.enemies.forEach((enemy) => {
            enemy.moveEnemy();
            this.checkEnemyBounds(enemy.y);
        });
    }

    checkEnemyBounds(y){
        if (y >= this.UPPER_LIMIT) {
            this.stopAnimation = true;
            this.showGameOver();
            this.backToWelcomeScreen();
            let sounds = document.getElementsByTagName('audio');
            for (let i = 0; i < sounds.length; i++) {
                sounds[i].pause();
            }
        }
    }

    showGameOver(){
        this.setBlackScreen();
        this.ctx.font = '36px W95FA';
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width/2, this.canvas.height/2);
    }

    backToWelcomeScreen(){
        setTimeout(() => {            
            //this.gameInstance.changeScreen();
        }, 3000);
    }

    showWinScreen(){
        this.setBlackScreen();
        this.ctx.font = '36px W95FA';
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('You Win!!', this.canvas.width/2, this.canvas.height/2);
    }

    refreshScreen(){
        if (this.stopAnimation) return;
        this.setBlackScreen();
        this.printPlayer();
        this.printEnemies();
        this.printBullets();
        this.checkCollision();
    }

    checkCollision(){
        this.checkPlayerBulletCollision();
        this.checkEnemyBulletCollision();
        this.checkGameWin();
    }

    checkGameWin(){
        if (this.TOTAL_ALIENS === 0) {
            setTimeout(() => {
                this.stopAnimation = true;
                this.showWinScreen();
            }, 2000);
            this.backToWelcomeScreen();
        }
    }

    checkPlayerBulletCollision(){
        this.gameSprites.enemies.forEach((enemy, indexEnemy) => {
            this.gameSprites.bullets.forEach((bullet, indexBullets) => {
                if (this.checkBulletCollision(bullet, enemy) && bullet.velocity === 1) {
                    enemy.destroyEnemy().then(() => {
                        this.TOTAL_ALIENS--;
                    })
                    bullet.destroyBullet();
                    this.gameSprites.bullets.splice(indexBullets, 1);
                }
            });
        });
    }

    checkEnemyBulletCollision(){
        this.gameSprites.bullets.forEach((bullet, indexBullets) => {
            if (this.checkBulletCollision(bullet, this.gameSprites.player) && bullet.velocity === -1) {
                this.stopAnimation = true;
                this.showGameOver();
            }
        });
    }
    
    checkBulletCollision(bullet, enemy) {
        return bullet.vertex.some((bulletVertex) => {
            return bulletVertex[0] > enemy.vertex[0][0] && bulletVertex[0] < enemy.vertex[1][0] &&
                bulletVertex[1] > enemy.vertex[0][1] && bulletVertex[1] < enemy.vertex[2][1];
        });
    }

    enemyShoot(){
        this.gameSprites.enemies.forEach((enemy) => {
            let random = Math.floor(Math.random() * 100);
            if (random === 1) {
                this.gameSprites.bullets.push(new Bullet(enemy.x+2, enemy.y+3, -1));
            }
        });
    }

    setBlackScreen() {
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawPixel(x, y){
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
        if (e.key === 'Enter') this.changeScreen(true);
    }

    constructor() {
        this.controllMenu = new ControllMenu();
        this.welcomeScreen = new WelcomeScreen();
        this.gameScreen = new GameScreen(this);
        this.screens = [this.welcomeScreen, this.controllMenu, this.gameScreen];
        this.currentScreen = 0;
        this.init();
        document.addEventListener('keydown', this.eventChangeScreen);
    }

    init() {
        this.screens[this.currentScreen].init();
    }

    async changeScreen(pressedKey = false) {
        if (this.currentScreen === 2 && pressedKey) return;
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