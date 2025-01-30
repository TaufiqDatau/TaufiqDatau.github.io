canvas.addEventListener('click', (event) => {
    // Get the click position
    const clickX = event.offsetX;
    const clickY = event.offsetY;

    if (interacting) return;

    interactables.forEach((interactable) => {
        if (interactable.isClicked(clickX, clickY) && playerSprite.CanInteract) {
            interactAction();
        }
    });
});

canvas.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && playerSprite.CanInteract) {
        interactAction();
    }
})

