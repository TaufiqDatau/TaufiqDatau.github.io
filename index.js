const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const image = new Image();
const playerImage = new Image();

class Sprite {
    constructor({
        position,
        velocity,
        image
    }){
        this.position = position;
        this.image = image
    }

      

    draw(){
        if (this.image.complete) {
            // Calculate camera offsets
            const cameraX = player.x - canvas.width / 2;
            const cameraY = player.y - canvas.height / 2;
            c.drawImage(image, -cameraX - 300, -cameraY - 900); // Offset the map to center on the player
        }
    }
}

const background = new Sprite({
    position:{
        x: canvas.width,
        y: canvas.height
    },
    image: image
})

// Player's position in the game world
const player = {
  x: 512, // Initial x-coordinate in the game world
  y: 288, // Initial y-coordinate in the game world
  width: 50, // Width of player sprite
  height: 72, // Height of player sprite
};

const keys = {
    w : {
        pressed: false
    },
    a : {
        pressed: false
    },
    s : {
        pressed: false
    },
    d : {
        pressed: false
    }
}

function animate(){
    window.requestAnimationFrame(animate)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    background.draw()
    console.log('animate')
  
    // Fill the background
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
  
    // Calculate camera offsets
    const cameraX = player.x - canvas.width / 2;
    const cameraY = player.y - canvas.height / 2;
  
    // Redraw the map and player
    if (image.complete) {
      c.drawImage(image, -cameraX - 300 - background.position.x, -cameraY - 900 - background.position.y); // Offset the map to center on the player
    }
    if (playerImage.complete) {
      c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width / 4, // Draw one frame of the sprite
        playerImage.height,
        canvas.width / 2 - player.width / 2, // Center the player
        canvas.height / 2 - player.height / 2,
        player.width,
        player.height
      );
    }

    if (keys.w.pressed){
        background.position.y = background.position.y - 3
    } else if (keys.s.pressed){
        background.position.y = background.position.y + 3
    }else if (keys.a.pressed) {
        background.position.x = background.position.x - 3
    }else if (keys.d.pressed){
        background.position.x = background.position.x + 3
    }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Fill the background
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate camera offsets
  const cameraX = player.x - canvas.width / 2;
  const cameraY = player.y - canvas.height / 2;

  // Redraw the map and player
  if (image.complete) {
    c.drawImage(image, -cameraX - 300, -cameraY - 900); // Offset the map to center on the player
  }
  if (playerImage.complete) {
    c.drawImage(
      playerImage,
      0,
      0,
      playerImage.width / 4, // Draw one frame of the sprite
      playerImage.height,
      canvas.width / 2 - player.width / 2, // Center the player
      canvas.height / 2 - player.height / 2,
      player.width,
      player.height
    );
  }
}

// Handle resizing
window.addEventListener('resize', resizeCanvas);

// Load images
image.src = './img/InitialMap.png';
playerImage.src = './img/playerDown.png';

// Ensure images are drawn once loaded
image.onload = resizeCanvas;
playerImage.onload = resizeCanvas;

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
resizeCanvas();
animate();
