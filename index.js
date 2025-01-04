const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const image = new Image();
const playerImage = new Image();
const collision = [];
for (i = 0; i < data.length; i += 70) {
    collision.push(data.slice(i, i + 70))
}
const boundaries = []
// Player's position in the game world
const player = {
    x: 370, // Initial x-coordinate in the game world
    y: 825, // Initial y-coordinate in the game world
    width: 50, // Width of player sprite
    height: 72, // Height of player sprite
};

const offset = {
    x: 0,
    y: 0
}
class Sprite {
    constructor({
        position,
        velocity,
        image,
        frames = { max: 1 }
    }) {
        this.position = position;
        this.image = image
        this.frames = frames
    }



    draw({ offsetX = 0, offsetY = 0 }) {
        if (this.image.complete) {

            c.drawImage(
                this.image,
                0,
                0,
                this.image.width / this.frames.max, // Draw one frame of the sprite
                this.image.height,
                offsetX - this.position.x,
                offsetY - this.position.y,
                this.image.width / this.frames.max,
                this.image.height
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

    draw({ offsetX, offsetY }) {
        const cameraX = player.x - canvas.width / 2;
        const cameraY = player.y - canvas.height / 2;
        c.fillStyle = 'red';
        c.fillRect(
            this.position.x - offsetX - cameraX,
            this.position.y - offsetY - cameraY,
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
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    }
                })
            )
        }

    })
});



const background = new Sprite({
    position: {
        x: canvas.width,
        y: canvas.height
    },
    image: image
});

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


function animate() {
    window.requestAnimationFrame(animate)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cameraX = player.x - canvas.width / 2;
    const cameraY = player.y - canvas.height / 2;
    background.draw({ offsetX: -cameraX - offset.x, offsetY: -cameraY - offset.y })
    // Draw boundaries adjusted for camera movement
    boundaries.forEach(boundary => {
        boundary.draw({
            offsetX: background.position.x,
            offsetY: background.position.y
        });


    })
    if (playerImage.complete) {
        c.drawImage(
            playerImage,
            0,
            0,
            playerImage.width / 4, // Draw one frame of the sprite
            playerImage.height,
            canvas.width / 2 - player.width / 2, // Center the player
            canvas.height / 2 - player.height / 2,
            playerImage.width / 4,
            playerImage.height
        );
    }



    if (keys.w.pressed) {
        background.position.y = background.position.y - 9
    } else if (keys.s.pressed) {
        background.position.y = background.position.y + 9
    } else if (keys.a.pressed) {
        background.position.x = background.position.x - 9
    } else if (keys.d.pressed) {
        background.position.x = background.position.x + 9
    }
}



// Load images
image.src = './img/InitialMap.png';
playerImage.src = './img/playerDown.png';


// Ensure images are drawn once loaded
image.onload = animate;
playerImage.onload = animate;

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
