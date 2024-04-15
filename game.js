import WelcomeScreen from './welcomeScreen.js';
import ControlMenu from './controlMenu.js';
import GameScreen from './gameScreen.js';           

class Game {
    eventChangeScreen = (e) => {
        if (e.key === 'Enter') this.changeScreen();
    }

    init() {
        this.controlMenu = new ControlMenu();
        this.welcomeScreen = new WelcomeScreen();
        this.gameScreen = new GameScreen(this.gameFinished);
        this.screens = [this.welcomeScreen, this.controlMenu, this.gameScreen];
        this.currentScreen = 0;
        document.addEventListener('keydown', this.eventChangeScreen);   
        this.screens[this.currentScreen].init();
    }

    async changeScreen() {
        if (this.currentScreen === 2) return;
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
game.init();