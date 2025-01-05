class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        scale = 1,
        sprites
    }) {
        this.position = position;
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.scale = scale;
        this.moving = false;
        this.sprites = sprites;

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max * this.scale
            this.height = this.image.height * this.scale
        }
    }



    draw() {
        if (this.image.complete) {
            c.drawImage(
                this.image,
                this.frames.val * this.width,
                0,
                this.image.width / this.frames.max, // Draw one frame of the sprite
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames.max * this.scale,
                this.image.height * this.scale
            );
            if(!this.moving) return;
            if (this.frames.max > 1) {
                this.frames.elapsed++
            }

            if (this.frames.elapsed % 10 == 0) {
                this.frames.elapsed = 0;
                if (this.frames.val < this.frames.max - 1) this.frames.val++;
                else this.frames.val = 0;
            }
        }
    }
}

class Boundary {
    static width = 48;
    static height = 48;


    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {

        c.fillStyle = 'rgba(255, 0, 0, 0)'; // Fully transparent red

        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}