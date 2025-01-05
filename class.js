class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        scale = 1
    }) {
        this.position = position;
        this.image = image
        this.frames = frames
        this.scale = scale

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max * this.scale
            this.height = this.image.height * this.scale
        }
    }



    draw() {
        if (this.image.complete) {
            c.drawImage(
                this.image,
                0,
                0,
                this.image.width / this.frames.max , // Draw one frame of the sprite
                this.image.height ,
                this.position.x,
                this.position.y,
                this.image.width / this.frames.max * this.scale,
                this.image.height * this.scale
            );

        }
    }
}

