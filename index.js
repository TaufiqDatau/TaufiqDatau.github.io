const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const image = new Image();
const playerImage = new Image();
const foregroundImage = new Image();
const collision = [];
for (i = 0; i < data.length; i += 70) {
    collision.push(data.slice(i, i + 70))
}
const boundaries = []
// Player's position in the game world
const player = {
    x: 325, // Initial x-coordinate in the game world
    y: 745, // Initial y-coordinate in the game world
    width: 50, // Width of player sprite
    height: 72, // Height of player sprite
};

const offset = {
    x: 0,
    y: -500
}
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




collision.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1025) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.height + offset.x,
                        y: i * Boundary.width + offset.y
                    }
                })
            )
        }

    })
});



const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});
const foreground = new Sprite({
    position: {
        x: offset.x ,
        y: offset.y 
    },
    image: foregroundImage
})


const playerSprite = new Sprite({
    position: {
        x: 700,
        y: 450,
    },
    image: playerImage,
    frames: { max: 4 },
    scale: 0.8
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const testBoundary = new Boundary({
    position: {
        x: 400,
        y: 400
    }
})

const movables = [background, ...boundaries,foreground]
function animate() {
    window.requestAnimationFrame(animate)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    background.draw()
    // Draw boundaries adjusted for camera movement
    boundaries.forEach(boundary => {
        boundary.draw();

    });

    // testBoundary.draw();

    playerSprite.draw();
    foreground.draw();


    let moving = true;
    if (keys.w.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: playerSprite,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach(movableObject => {
                movableObject.position.y += 3
            })
        }
    } else if (keys.s.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: playerSprite,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach(movableObject => {
                movableObject.position.y -= 3;
            })
        }
    } else if (keys.a.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: playerSprite,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach(movableObject => {
                movableObject.position.x += 3;
            })
        }
    } else if (keys.d.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: playerSprite,
                    rectangle2: {
                        ...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y 
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach(movableObject => {
                movableObject.position.x -= 3;
            })
        }
    }
}



// Load images
image.src = './img/InitialMap.png';
playerImage.src = './img/playerDown.png';
foregroundImage.src = './img/Foreground.png'



// Keypress event listener
window.addEventListener('keypress', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            keys.a.pressed = false;
            keys.s.pressed = false;
            keys.d.pressed = false;
            break;
        case 'a':
            keys.w.pressed = false;
            keys.a.pressed = true;
            keys.s.pressed = false;
            keys.d.pressed = false;
            break;
        case 's':
            keys.w.pressed = false;
            keys.a.pressed = false;
            keys.s.pressed = true;
            keys.d.pressed = false;
            break;
        case 'd':
            keys.w.pressed = false;
            keys.a.pressed = false;
            keys.s.pressed = false;
            keys.d.pressed = true;
            break;
        default:
            // Optionally handle other keys or ignore
            break;
    }
});

// Key release event listener (optional)
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        default:
            break;
    }
});

// Initial setup
animate();
