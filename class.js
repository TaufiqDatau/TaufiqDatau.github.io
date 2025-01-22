
class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        scale = 1,
        sprites,
        animate = false,
        rotation = false,
    }) {
        this.position = position;
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.scale = scale;
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.rotation = rotation;
        this.CanInteract = false;
        this.interactImage = new Image();
        this.interactImage.src = `/img/interact.png`;


        this.image.onload = () => {
            this.width = this.image.width / this.frames.max * this.scale
            this.height = this.image.height * this.scale
        }
    }



    draw(height, width) {
        if (this.image.complete) {
            c.save();
            if (this.rotation > 0) {
                c.translate(
                    this.position.x + this.width / 2,
                    this.position.y + this.height / 2
                )
                c.rotate(0)
                c.translate(
                    -this.position.x + this.width / 2,
                    -this.position.y + this.height / 2
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
            if (this.CanInteract) {
                console.log('interact image')
                c.drawImage(
                    this.interactImage,
                    this.position.x + 5,
                    this.position.y - 20
                )
            }
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
}

class Monster extends Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        scale = 1,
        sprites,
        animate = false,
        rotation = false,
        isEnemy = false,
        name,
        attacks,
    }) {
        super({
            position,
            image,
            frames,
            scale,
            sprites,
            animate,
            rotation,
        })
        this.health = 100;
        this.isEnemy = isEnemy;
        this.name = name;
        this.attacks = attacks;
        this.isAttacking = false;

    }

    damageDealt(attack, recipient) {
        const targetHealth = recipient.isEnemy ? 'enemyHealthStatus' : 'myHealthStatus'
        recipient.health -= attack.damage;
        recipient.health = recipient.health < 0 ? 0 : recipient.health;
        const currentHealth = recipient.health + "%"
        gsap.to(`#${targetHealth} #currentHealth`, {
            width: currentHealth,
            onComplete: () => {
                if (recipient.health <= 0) {
                    setTimeout(() => {
                        gsap.to(recipient, {
                            opacity: 0
                        });
                    }, 200)
                }
                this.isAttacking = false;
            }
        });


    }

    attack({ attack, recipient, renderedSpritesEffect }) {
        this.isAttacking = true;
        const tl = gsap.timeline();
        const battleDialog = document.querySelector('.battleDialog');
        battleDialog.innerHTML = '';
        battleDialog.style.display = 'flex'
        battleDialog.innerHTML = this.name + ' used ' + attack.name;
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
                    frames: {
                        max: 4,
                        elapsed: 2
                    },
                    animate: true,
                    rotation: -1
                });
                renderedSpritesEffect.push(fireball);

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    duration: 0.5,
                    onComplete: () => {
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
                            yoyo: true,
                            onComplete: () => {
                            }
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
                    onComplete: () => {
                        // battleOption.forEach((obj) => {
                        //     obj.style.display = ''; // Restore original CSS
                        // });
                        // battleDialog.style.display = ''
                        // battleDialog.innerHTML = ''
                    }
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
        this.isTalking = false;
        this.currentText = '';
    }

    StartDialogue(img, textString) {
        console.log('dialog starting');
        this.onDialog = true;
        this.currentText = textString;

        // const imageElement = document.querySelector('#dialog-box img');
        const dialogBox = document.querySelector('#dialog-box');
        const textContent = document.querySelector('.text-content');
        const containerScroll = document.querySelector('.textbox');
        textContent.innerHTML = '';

        const characterImage = new Image();
        characterImage.src = '/img/Rise.png';
        characterImage.className = 'character-image';
        characterImage.alt = 'character';

        if (dialogBox) {
            dialogBox.insertBefore(characterImage, dialogBox.firstChild);
            dialogBox.style.display = ''; // Make the dialog box visible
        } else {
            dialogBox.style.display = 'none'
        }

        if (textContent) {
            this.isTalking = true;
            typeWriter(0, textString, textContent, containerScroll, this);
        }
    }

    nextButton() {
        const textContent = document.querySelector('.text-content');
        const containerScroll = document.querySelector('.textbox');

        if (this.isTalking) {
            clearTimeout(timeoutId);
            textContent.textContent = this.currentText;
            if (containerScroll) {
                containerScroll.scrollTop = containerScroll.scrollHeight;
            }
            this.isTalking = false;
        } else {
            if (this.onDialog) {
                this.onDialog = false;
                this.hideDialog();
                dispatchEvent();
            }
        }
    };

    startSkipButton() {
        document.querySelector('#skip-button').addEventListener('click', () => { this.nextButton() });
    }
    hideDialog() {
        const dialogBox = document.querySelector('#dialog-box');
        const textContent = document.querySelector('.text-content');
        const image = document.querySelector(`.character-image`);
        if (textContent) {
            textContent.innerHTML = '';
        }
        dialogBox.style.display = 'none';
        dialogBox.removeChild(image);
        this.isTalking = false;
    }
}

class DirectionButton {
    static TriggerButton(shouldAppear) {
        const controller = document.querySelector(".nes-controller");
        if (controller && shouldAppear) {
            controller.style.display = '';
        } else if (controller) {
            controller.style.display = 'none';
        }
    }

    checkClick(mouseX, mouseY) {
        const textBoxWidth = canvas.width * 0.8; // Adjust width as needed
        const textBoxHeight = canvas.height * 0.2; // Adjust height as needed
        const x = (canvas.width - textBoxWidth) / 2; // Center horizontally
        const y = canvas.height - textBoxHeight - 10; // Bottom with 10px padding
        return (
            mouseX >= x &&
            mouseX <= x + textBoxWidth &&
            mouseY >= y &&
            mouseY <= y + textBoxHeight &&
            this.onDialog
        );
    }

}

class Interactable {
    constructor({ position, width, height, actions }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.actions = actions;
    }

    draw() {
        c.fillStyle = 'red';
        // c.fillRect(
        //     this.position.x,
        //     this.position.y,
        //     this.width,
        //     this.height
        // );
        c.strokeStyle = 'red'; // Set the border color
        c.lineWidth = 2; // Set the border thickness
        c.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }

    isClicked(clickX, clickY) {
        // Check if the click is within the interactable bounds
        return (
            clickX >= this.position.x &&
            clickX <= this.position.x + this.width &&
            clickY >= this.position.y &&
            clickY <= this.position.y + this.height
        );
    }


}
