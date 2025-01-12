
class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        scale = 1,
        sprites,
        animate = false,
        isEnemy = false,
        rotation = false,
    }) {
        this.position = position;
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.scale = scale;
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.health = 100;
        this.isEnemy = isEnemy;
        this.rotation = rotation;

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max * this.scale
            this.height = this.image.height * this.scale
        }
    }



    draw(height, width) {
        if (this.image.complete) {
            c.save();
            if(this.rotation>0){
                c.translate(
                    this.position.x + this.width/2,
                    this.position.y + this.height/2
                )
                c.rotate(0)
                c.translate(
                    -this.position.x + this.width/2,
                    -this.position.y + this.height/2
                )
            }
            c.globalAlpha = this.opacity;
            c.drawImage(
                this.image,
                this.frames.val * this.width,
                0,
                this.image.width / this.frames.max, // Draw one frame of the sprite
                this.image.height,
                this.position.x,
                this.position.y,
                width ?? this.image.width / this.frames.max * this.scale,
                height ?? this.image.height * this.scale
            );
            c.restore()
            // // Draw the border
            // c.strokeStyle = 'red'; // Set the border color
            // c.lineWidth = 2; // Set the border thickness
            // c.strokeRect(this.position.x, this.position.y, this.width, this.height);

            if (!this.animate) return;
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

    damageDealt(attack, recipient) {
        const targetHealth = recipient.isEnemy ? 'enemyHealthStatus' : 'myHealthStatus'
        recipient.health -= attack.damage;
        recipient.health = recipient.health < 0 ? 0: recipient.health;
        const currentHealth = recipient.health + "%"
        gsap.to(`#${targetHealth} #currentHealth`, {
            width: currentHealth,
            onComplete() {
                if (recipient.health <= 0) {
                    setTimeout(() => {
                        gsap.to(recipient, {
                            opacity: 0
                        })
                    }, 200)
                }
            }
        });


    }

    attack({ attack, recipient, renderedSpritesEffect }) {
        const tl = gsap.timeline()
        switch (attack.name) {
            case 'Fireball':
                const fireBallImage = new Image();
                fireBallImage.src = './img/fireball.png';
                const fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y,
                    },
                    image: fireBallImage,
                    frames:{
                        max: 4,
                        elapsed: 2
                    },
                    animate: true,
                    rotation: -1
                });
                renderedSpritesEffect.push(fireball);

                gsap.to(fireball.position,{
                    x: recipient.position.x,
                    y: recipient.position.y,
                    duration: 0.5,
                    onComplete:()=>{
                        renderedSpritesEffect.pop();
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            repeat: 5,
                            duration: 0.1,
                            yoyo: true
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            duration: 0.1,
                            yoyo: true
                        });
                        this.damageDealt(attack, recipient);
                    }

                })
                break;
            case 'Tackle':
                tl.to(this.position, {
                    x: this.position.x - 20
                }).to(this.position, {
                    x: this.position.x + 40,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            repeat: 5,
                            duration: 0.1,
                            yoyo: true
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            duration: 0.1,
                            yoyo: true
                        });
                        this.damageDealt(attack, recipient);
                    }
                }).to(this.position, {
                    x: this.position.x,
                });
                break;
        }

    }
}



class Boundary {
    static width = 72;
    static height = 72;


    constructor({ position, color }) {
        this.position = position;
        this.width = 72;
        this.height = 72;
        this.color = color
    }

    draw() {

        c.fillStyle = this.color ?? 'rgba(255, 0, 0, 0)'; // Fully transparent red
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
    constructor({ str, image }) {
        this.content = str; // The text content to be displayed in the text box
        this.displayedText = ''; // Text currently displayed
        this.currentCharIndex = 0; // Index of the character being displayed
        this.scrollOffset = 0; // Current scroll position
        this.elapsed = 0;
        this.textBoxImage = image
        this.onDialog = false;
    }

    draw(canvas, character) {
        if (!this.onDialog) return;

        // Set the dimensions and position of the text box
        const textBoxWidth = canvas.width * 0.8; // Adjust width as needed
        const textBoxHeight = canvas.height * 0.2; // Adjust height as needed
        const x = (canvas.width - textBoxWidth) / 2; // Center horizontally
        const y = canvas.height - textBoxHeight - 10; // Bottom with 10px padding
        if (character) {
            character.position.x = x;
            character.position.y = y - character.height;
            character.draw()
        }

        // Draw the text box
        c.drawImage(this.textBoxImage, x, y, textBoxWidth, textBoxHeight);

        // Set text properties
        c.font = '20px rpg'; // Customize font size and style
        c.fillStyle = 'white'; // Text color
        c.textAlign = 'left';

        // Calculate the text area inside the box
        const padding = 15; // Padding for text inside the box
        const textX = x + padding;
        const textY = y + padding + 25;
        const textWidth = textBoxWidth - 2 * padding;
        const lineHeight = 35; // Adjust line height based on font size

        // Wrap the text
        const lines = this.wrapText(c, this.displayedText, textWidth);

        // Clip the text area to allow scrolling
        c.save();
        c.beginPath();
        c.rect(x + padding, y + padding, textWidth, textBoxHeight);
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
            if (this.elapsed % 2 == 0) {
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
        if (this.currentCharIndex < this.content.length) return;

        // Calculate the total height of all lines
        const textBoxWidth = canvas.width * 0.8;
        const padding = 15;
        const textWidth = textBoxWidth - 2 * padding;
        const lineHeight = 30;
        const lines = this.wrapText(c, this.content, textWidth);
        const totalHeight = lines.length * lineHeight;

        // Limit scrolling within bounds
        const maxScroll = Math.max(0, totalHeight - (canvas.height * 0.2 - 2 * 50));
        this.scrollOffset = Math.max(0, Math.min(this.scrollOffset + amount, maxScroll));
    }

    restartText() {
        this.currentCharIndex = 0;
        this.displayedText = '';
        this.scrollOffset = 0;
    }
}
