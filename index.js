const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const image = new Image();

const foregroundImage = new Image();
const textBoxImage = new Image();
textBoxImage.src = './img/text-box.png'
const collision = [];
const battleZone = [];

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';
const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';
const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';
const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const RiseImage = new Image();
RiseImage.src = './img/Rise.png'

for (i = 0; i < collisionData.length; i += 70) {
    collision.push(collisionData.slice(i, i + 70));
}
const boundaries = [];
const battleZones = [];

for(j = 0; j< battlezoneData.length; j+= 70){
    battleZone.push(battlezoneData.slice(j, j+70));
}
// Player's position in the game world
const player = {
    x: 325, // Initial x-coordinate in the game world
    y: 745, // Initial y-coordinate in the game world
    width: 50, // Width of player sprite
    height: 72, // Height of player sprite
};

const offset = {
    x: -175,
    y: -1200
}


collision.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1432) {
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

battleZone.forEach((row, i)=>{
    row.forEach((symbol, j)=>{
        if(symbol == 1537){
           battleZones.push( new Boundary({
                position:{
                    x: j * Boundary.height + offset.x,
                    y: i * Boundary.width + offset.y
                },
                color: 'green'
            })
        )
        }
    })
})



const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
});
const rise = new Sprite({
    position:{
        x: 0,
        y: 0,
    },
    image: RiseImage,
    scale: 2
})
const OpeningString = `Hey, hey! 🎤 Welcome to Taufiq personal website—no, wait, scratch that! It’s more like your front-row ticket to an RPG epic starring… drumroll please... a Software Engineering Hero! 🌟 You’re gonna love it here, trust me! The whole site? It’s like a game where you get to explore [Your Name’s] incredible skills and projects. 💻✨
`
const textBox = new TextBox({str:OpeningString,image:textBoxImage});


const playerSprite = new Sprite({
    position: {
        x: 700,
        y: 450,
    },
    image: playerDownImage,
    frames: { max: 4 },
    scale: 1,
    sprites:{
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
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
    },
    arrowUp: {
        pressed: false
    },
    arrowDown:{
        pressed: false
    },
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const movables = [background, ...boundaries, foreground, ...battleZones]
function animate() {
    window.requestAnimationFrame(animate)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    background.draw()
    // Draw boundaries adjusted for camera movement
    boundaries.forEach(boundary => {
        boundary.draw();
    });
    battleZones.forEach(bz =>{
        bz.draw();
    })
   

    playerSprite.draw();
    foreground.draw();
    textBox.draw(canvas,rise);
    



    let moving = true;
    if (textBox.onDialog){
        playerSprite.moving = false;
        playerSprite.frames.val = 0;
        if(keys.w.pressed){
            textBox.scroll(5,canvas)
        }else if(keys.s.pressed){
            textBox.scroll(-5,canvas)
        }
        return;
    };
    if (keys.w.pressed) {
        playerSprite.moving = true;
        playerSprite.image = playerSprite.sprites.up;
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
        playerSprite.moving = true;
        playerSprite.image = playerSprite.sprites.down;
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
        playerSprite.moving = true;
        playerSprite.image = playerSprite.sprites.left;
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
        playerSprite.moving = true;
        playerSprite.image = playerSprite.sprites.right;
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
image.src = './img/NewMap.png';
foregroundImage.src = './img/Foreground_Map.png'



// Keypress event listener
window.addEventListener('keypress', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            console.log('up pressed')
            keys.arrowUp.pressed = true;
            break;
        case 'ArrowDown':
            keys.arrowDown.pressed = true;
        case 'Enter':
            textBox.restartText();
            textBox.onDialog = !textBox.onDialog;
            break;
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
        case 'ArrowUp':
            keys.arrowUp.pressed = false;
            break;
        case 'ArrowDown':
            keys.arrowDown.pressed = false;
            break;
        case 'w':
            playerSprite.moving = false;
            keys.w.pressed = false;
            break;
        case 'a':
            playerSprite.moving = false;
            keys.a.pressed = false;
            break;
        case 's':
            playerSprite.moving = false;
            keys.s.pressed = false;
            break;
        case 'd':
            playerSprite.moving = false;
            keys.d.pressed = false;
            break;
        default:
            break;
    }
});

// Initial setup
animate();
