export default class Player {
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