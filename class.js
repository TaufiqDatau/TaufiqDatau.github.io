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
            c.strokeStyle = 'red'; // Set the border color
            c.lineWidth = 2; // Set the border thickness
            c.strokeRect(this.position.x, this.position.y, this.width, this.height);

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
        c.strokeStyle = 'red'; // Set the border color
        c.lineWidth = 2; // Set the border thickness
        c.strokeRect(this.position.x, this.position.y, this.width, this.height);

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
        this.displayedText = ''; // Text currently displayed
        this.currentCharIndex = 0; // Index of the character being displayed
        this.scrollOffset = 0; // Current scroll position
        this.elapsed = 0;
        this.textBoxImage = image
    }

    draw(canvas) {
        const c = canvas.getContext('2d');

        // Set the dimensions and position of the text box
        const textBoxWidth = canvas.width * 0.8; // Adjust width as needed
        const textBoxHeight = canvas.height * 0.2; // Adjust height as needed
        const x = (canvas.width - textBoxWidth) / 2; // Center horizontally
        const y = canvas.height - textBoxHeight - 10; // Bottom with 10px padding

        // Draw the text box
        c.drawImage(this.textBoxImage, x, y, textBoxWidth, textBoxHeight);

        // Set text properties
        c.font = '25px rpg'; // Customize font size and style
        c.fillStyle = 'white'; // Text color
        c.textAlign = 'left';

        // Calculate the text area inside the box
        const padding = 15; // Padding for text inside the box
        const textX = x + padding;
        const textY = y + padding + 25;
        const textWidth = textBoxWidth - 2 * padding;
        const lineHeight = 25; // Adjust line height based on font size

        // Wrap the text
        const lines = this.wrapText(c, this.displayedText, textWidth);

        // Clip the text area to allow scrolling
        c.save();
        c.beginPath();
        c.rect(x + padding, y + padding, textWidth, textBoxHeight - 2 * padding);
        c.clip();

        // Draw visible lines based on scrollOffset
        let currentY = textY - this.scrollOffset;
        for (const line of lines) {
            if (currentY + lineHeight > y + textBoxHeight - padding) break; // Stop if exceeding box height
            if (currentY + lineHeight > y + padding) {
                c.fillText(line, textX, currentY);
            }
            currentY += lineHeight;
        }

        c.restore(); // Restore the canvas clipping

        // Automatically scroll the text if necessary to follow the typewriter effect
        if (this.currentCharIndex < this.content.length) {
            if(this.elapsed % 2 == 0){
                this.displayedText += this.content[this.currentCharIndex];
                this.currentCharIndex++;
    
                // Scroll down as new text is added
                const totalHeight = lines.length * lineHeight;
                const boxHeight = textBoxHeight - (2 * padding + 25);
                if (totalHeight > boxHeight) {
                    const maxScroll = totalHeight - boxHeight;
                    this.scrollOffset = Math.min(this.scrollOffset + lineHeight, maxScroll);
                }
                this.elapsed = 0;
            }
            this.elapsed++;
        }
    }

    wrapText(context, text, maxWidth) {
        const words = text.split(' '); // Split text into words
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + word + ' ';
            const testWidth = context.measureText(testLine).width;

            if (testWidth > maxWidth) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines;
    }

    // Scroll the text box manually (for custom scroll behavior)
    scroll(amount, canvas) {
        const c = canvas.getContext('2d');

        // Calculate the total height of all lines
        const textBoxWidth = canvas.width * 0.8;
        const padding = 15;
        const textWidth = textBoxWidth - 2 * padding;
        const lineHeight = 30;
        const lines = this.wrapText(c, this.content, textWidth);
        const totalHeight = lines.length * lineHeight;

        // Limit scrolling within bounds
        const maxScroll = Math.max(0, totalHeight - (canvas.height * 0.2 - 2 * padding));
        this.scrollOffset = Math.max(0, Math.min(this.scrollOffset + amount, maxScroll));
    }

    restartText(){
        this.currentCharIndex = 0;
        this.displayedText = '';
        this.scrollOffset = 0;
    }

   

    
}
