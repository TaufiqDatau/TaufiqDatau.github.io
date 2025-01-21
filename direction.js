
// Function to handle key press and touch events
function handleMovementInput(key, action) {
    switch (key) {
        case 'ArrowUp':
        case 'w':
            keys.w.pressed = action === 'start';
            keys.a.pressed = false;
            keys.s.pressed = false;
            keys.d.pressed = false;
            break;
        case 'ArrowDown':
        case 's':
            keys.w.pressed = false;
            keys.a.pressed = false;
            keys.s.pressed = action === 'start';
            keys.d.pressed = false;
            break;
        case 'ArrowLeft':
        case 'a':
            keys.w.pressed = false;
            keys.a.pressed = action === 'start';
            keys.s.pressed = false;
            keys.d.pressed = false;
            break;
        case 'ArrowRight':
        case 'd':
            keys.w.pressed = false;
            keys.a.pressed = false;
            keys.s.pressed = false;
            keys.d.pressed = action === 'start';
            break;
        default:
            break;
    }

    // Stop animation when any key or touch ends
    if (action === 'end') {
        playerSprite.animate = false;
    }
}



function initDirection() {

    // Event listeners for keyboard input
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
            handleMovementInput(e.key, 'start');
        }
        if (e.key === 'Enter') {
            if(textBox.isTalking){
                keys.enter.pressed = true;
            }else if(!keys.enter.pressed){
                textBox.StartDialogue('', OpeningString);
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
            handleMovementInput(e.key, 'end');
        }
        if (e.key === 'Enter') {
                keys.enter.pressed = false;
        }
    });

    // Event listeners for touch input
    document.getElementById('up').addEventListener('touchstart', function () {
        handleMovementInput('w', 'start');
    });
    document.getElementById('left').addEventListener('touchstart', function () {
        handleMovementInput('a', 'start');
    });
    document.getElementById('down').addEventListener('touchstart', function () {
        handleMovementInput('s', 'start');
    });
    document.getElementById('right').addEventListener('touchstart', function () {
        handleMovementInput('d', 'start');
    });

    document.getElementById('up').addEventListener('touchend', function () {
        handleMovementInput('w', 'end');
    });
    document.getElementById('left').addEventListener('touchend', function () {
        handleMovementInput('a', 'end');
    });
    document.getElementById('down').addEventListener('touchend', function () {
        handleMovementInput('s', 'end');
    });
    document.getElementById('right').addEventListener('touchend', function () {
        handleMovementInput('d', 'end');
    });

    // Joystick interaction handling
    manager.on('start', function () {
        const element = document.querySelector('.nipple');
        if (element) {
            element.style.display = 'absolute';
        }
        isJoystickActive = true;
    });

    manager.on('dir', function (evt, data) {
        switch (data.direction.angle) {
            case 'up':
                handleMovementInput('w', 'start');
                break;
            case 'down':
                handleMovementInput('s', 'start');
                break;
            case 'left':
                handleMovementInput('a', 'start');
                break;
            case 'right':
                handleMovementInput('d', 'start');
                break;
            default:
                handleMovementInput('w', 'end');
                break;
        }
    });

    manager.on('end', function () {
        handleMovementInput('w', 'end');
        const element = document.querySelector('.nipple');
        if (element) {
            element.style.display = 'none';
        }
        isJoystickActive = false;
    });
}
