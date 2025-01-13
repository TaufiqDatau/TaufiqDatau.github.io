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

for (j = 0; j < battlezoneData.length; j += 70) {
    battleZone.push(battlezoneData.slice(j, j + 70));
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

battleZone.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1537) {
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.height + offset.x,
                    y: i * Boundary.width + offset.y
                },
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
    position: {
        x: 0,
        y: 0,
    },
    image: RiseImage,
    scale: 2
})
const OpeningString = `Hello there! Welcome to Taufiq personal website! ` +

`Unlike other websites where you just scroll and browse, here you'll navigate the world like an early RPG game. 🌟 ` +
`You can move using keyboard WASD keys. ` +

`Feel free to explore, interact with the surroundings, and have fun discovering everything this little world has to offer. Oh, and don’t miss the Monster battle feature—it’s my favorite! 🐾⚔️` +

`Have fun, and let me know what you think! ` +
`Press Enter to close this text box`

const textBox = new TextBox({ str: OpeningString, image: textBoxImage });
const battle = {
    initiated: false
}


const playerSprite = new Sprite({
    position: {
        x: 700,
        y: 450,
    },
    image: playerDownImage,
    frames: { max: 4 },
    scale: 1,
    sprites: {
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
    arrowDown: {
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
    battleZones.forEach(bz => {
        bz.draw();
    })


    playerSprite.draw();
    foreground.draw();
    textBox.draw(canvas, rise);

    if (battle.initiated) return;

    if (keys.a.pressed || keys.w.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            //#region Area Calculation
            const zone = battleZones[i]
            const overlappingArea = (
                Math.min(
                    playerSprite.position.x + playerSprite.width,
                    zone.position.x + zone.width
                )
                - Math.max(
                    playerSprite.position.x,
                    zone.position.x)
            ) * (
                    Math.min(
                        playerSprite.position.y + playerSprite.height,
                        zone.position.y + zone.height
                    ) -
                    Math.max(
                        playerSprite.position.y,
                        zone.position.y
                    )
                )
            //#endregion


            if (
                rectangularCollision({
                    rectangle1: playerSprite,
                    rectangle2: zone
                }) &&
                overlappingArea > (playerSprite.height * playerSprite.width) / 2 &&
                Math.random() < 0.01
            ) {
                battle.initiated = true;
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    backgroundColor: "red", // Adds a red tint for a dangerous vibe
                    duration: 0.4,
                    repeat: 3,
                    yoyo: true,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            backgroundColor: "black", // Resets the color
                            duration: 0.4,
                            onComplete() {
                                animateBattle();
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 1,
                                    onComplete() {
                                        worm.health = 100;
                                        myMonster.health = 100;
                                        restoreHealth(worm,100);
                                        restoreHealth(myMonster,100);
                                        resetOpacity(worm);
                                        resetOpacity(myMonster);
                                        const battleCommand = document.querySelector('#battleCommand');
                                        battleCommand.style.display = 'flex';
                                        
                                        gsap.to("#battleCommand", {
                                            duration: 1.5, // Animation duration in seconds
                                            width: "calc(100% - 16px)", // Full width of the container
                                            ease: "power3.out", // Smooth easing effect,
                                            onComplete() {
                                                hideDivs()
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                break;
            }
        }
    }



    if (handleTextBoxInteraction(textBox, playerSprite, canvas)) return;
    handleMovement();

}

function restoreHealth(recipient, maxHealth) {
    // Ensure recipient is valid and has a health property
    if (!recipient || typeof recipient.health === "undefined") {
        console.error("Invalid recipient!");
        return;
    }

    // Restore health to maximum value
    recipient.health = maxHealth;

    // Determine the target health bar based on the recipient
    const targetHealth = recipient.isEnemy ? 'enemyHealthStatus' : 'myHealthStatus';
    
    // Update the health bar visually
    const currentHealth = recipient.health + "%";
    gsap.to(`#${targetHealth} #currentHealth`, {
        width: currentHealth,
        duration: 1, // Smooth animation for restoring health
    });
}

function resetOpacity(recipient, duration = 0.1) {

    // Set opacity back to 1 on both the recipient object and the DOM
    gsap.to(recipient, {
        opacity: 1,
        duration: duration,
        onComplete: () => {
            recipient.opacity = 1; // Update the object's property
        },
    });
}


function handleTextBoxInteraction(textBox, playerSprite, canvas) {
    if (!textBox.onDialog) return false; // Return false if there's no dialog interaction

    // Stop the player's movement and reset animation frames
    playerSprite.animate = false;
    playerSprite.frames.val = 0;

    // Handle scrolling through the dialog using keys
    if (keys.w.pressed) {
        textBox.scroll(5, canvas);
    } else if (keys.s.pressed) {
        textBox.scroll(-5, canvas);
    }

    return true; // Interaction handled
}


function handleMovement() {
    if (keys.w.pressed) movePlayer('up', 'y', 6)
    else if (keys.s.pressed) movePlayer('down', 'y', -6)
    else if (keys.a.pressed) movePlayer('left', 'x', 6)
    else if (keys.d.pressed) movePlayer('right', 'x', -6)
}

function movePlayer(direction, axis, offset) {
    let moving = true;
    playerSprite.animate = true;
    playerSprite.image = playerSprite.sprites[direction];

    for (let boundary of boundaries) {
        const newBoundaryPosition = {
            x: boundary.position.x,
            y: boundary.position.y
        };
        newBoundaryPosition[axis] += offset; // Only update the relevant axis

        if (
            rectangularCollision({
                rectangle1: playerSprite,
                rectangle2: { ...boundary, position: newBoundaryPosition }
            })
        ) {
            moving = false;
            break;
        }
    }

    if (moving) {
        movables.forEach((movable) => {
            movable.position[axis] += offset;
        });
    }
}



document.querySelector('.battleDialog').addEventListener('click',(e)=>{
    if(queue.length > 0){
        if(worm.health>0)queue[0]();
        else e.currentTarget.style.display = 'none'
        queue.shift();
    } else e.currentTarget.style.display = 'none'

    if(worm.health <= 0 || myMonster.health <=0){
        gsap.to('#overlappingDiv',{
            opacity:1,
            onComplete:()=>{
                cancelAnimationFrame(battleAnimationId)
                hideDivs('none');
                battle.initiated = false;
                gsap.to('#overlappingDiv',{
                    opacity:0,
                    
                })
            }
        })
    }
})




const battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png'



const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
});
const bgOriginalWidth = 1024; // Replace with your background's original width
const bgOriginalHeight = 576; // Replace with your background's original height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



// Calculate scale factors
const scaleX = canvas.width / bgOriginalWidth;
const scaleY = canvas.height / bgOriginalHeight;


const worm = new Monster({
    ...Monsters.Worm,
    position: {
        x: bgOriginalWidth * 0.8 * scaleX,
        y: bgOriginalHeight * 0.2 * scaleY,
    },
});

const myMonster = new Monster({
    ...Monsters.Emby,
    position: {
        x: bgOriginalWidth * 0.3 * scaleX,
        y: bgOriginalHeight * 0.6 * scaleY
    },
});

myMonster.attacks.forEach((attack)=>{
    const Button = document.createElement("button")
    Button.innerHTML = attack.name;
    document.querySelector('.battleOption').append(Button);
})

const renderedSpritesEffect = []
let battleAnimationId;
function animateBattle() {


    battleAnimationId = window.requestAnimationFrame(animateBattle);

    // Draw the background
    battleBackground.draw(canvas.height, canvas.width);
    worm.draw();
    myMonster.draw();
    renderedSpritesEffect.forEach((effect)=>{
        effect.draw();
    })
}


function typeWriter(index, text, textElement) {
    if (index < text.length) {
        textElement.textContent += text[index];
        index++;
        setTimeout(() => typeWriter(index, text, textElement), 20)
    } else {
        // Stop the blinking cursor after typing finishes
        textElement.style.borderRight = "none";
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
            playerSprite.animate = false;
            keys.w.pressed = false;
            break;
        case 'a':
            playerSprite.animate = false;
            keys.a.pressed = false;
            break;
        case 's':
            playerSprite.animate = false;
            keys.s.pressed = false;
            break;
        case 'd':
            playerSprite.animate = false;
            keys.d.pressed = false;
            break;
        default:
            break;
    }
});

const queue = []

document.querySelectorAll('#battleCommand button').forEach((button) => {
    button.addEventListener('click', (event) => {
        myMonster.attack({ attack: attacks[event.currentTarget.innerHTML], recipient: worm, renderedSpritesEffect });

        queue.push(()=>{
            worm.attack({
                attack: attacks.Tackle,
                recipient:myMonster,
                renderedSpritesEffect
            })
        })
    });
});

function hideDivs(setDiv='') {
    const ids = ["battleCommand", "enemyHealthStatus", "myHealthStatus"];
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = setDiv ;
        }
    });
}

// Initial setup
hideDivs('none');
textBox.onDialog = true;
animate();
// animateBattle();







