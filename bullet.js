export default class Bullet {
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