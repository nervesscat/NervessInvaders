export default class Enemy {
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