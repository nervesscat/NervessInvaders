import CanvasHandler from "./canvasHandler.js";

import Bullet from './bullet.js';
import Enemy from './enemy.js';
import Player from './player.js';

export default class GameScreen extends CanvasHandler{
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
            this.showGameOverScreen();
            this.backToWelcomeScreen();
            let sounds = document.getElementsByTagName('audio');
            for (let i = 0; i < sounds.length; i++) {
                sounds[i].pause();
            }
        }
    }

    showGameOverScreen(){
        this.setBlackScreen();
        this.ctx.font = '36px W95FA';
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width/2, this.canvas.height/2);
    }

    backToWelcomeScreen(){
        setTimeout(() => {            
            this.gameInstance.gameInstance = true;
        }, 3000);
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

    showWinScreen(){
        this.setBlackScreen();
        this.ctx.font = '36px W95FA';
        this.ctx.fillStyle = this.spriteColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('You Win!!', this.canvas.width/2, this.canvas.height/2);
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
                this.showGameOverScreen();
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

    refreshScreen(){
        if (this.stopAnimation) return;
        this.setBlackScreen();
        this.printPlayer();
        this.printEnemies();
        this.printBullets();
        this.checkCollision();
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