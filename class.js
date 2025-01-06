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
            // // Draw the border
            // c.strokeStyle = 'red'; // Set the border color
            // c.lineWidth = 2; // Set the border thickness
            // c.strokeRect(this.position.x, this.position.y, this.width, this.height);

            if (!this.moving) return;
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
        // c.strokeStyle = 'red'; // Set the border color
        // c.lineWidth = 2; // Set the border thickness
        // c.strokeRect(this.position.x, this.position.y, this.width, this.height);

        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}

class TextBox {
    constructor({str, image}) {
        this.content = str; // The text content to be displayed in the text box
        this.textBoxImage = image
    }

    draw(canvas) {


            // Set the dimensions and position of the text box
            const textBoxWidth = canvas.width * 0.8; // Adjust width as needed
            const textBoxHeight = canvas.height * 0.2; // Adjust height as needed
            const x = (canvas.width - textBoxWidth) / 2; // Center horizontally
            const y = canvas.height - textBoxHeight - 10; // Bottom with 10px padding
            // Draw the text box
            c.drawImage(this.textBoxImage, x,y, textBoxWidth, textBoxHeight);


            // Set text properties
            c.font = '20px Arial'; // Customize font size and style
            c.fillStyle = 'black'; // Text color
            c.textAlign = 'center';

            // Draw the text inside the text box
            const textX = canvas.width / 2; // Center horizontally
            const textY = y + textBoxHeight / 2 + 5; // Center vertically in the box
            c.fillText(this.content, textX, textY);

    }
}
