canvas.addEventListener('click', (event) => {
    // Get the click position
    const clickX = event.offsetX;
    const clickY = event.offsetY;

    // Check if the interactable is clicked
    if (interactable.isClicked(clickX, clickY) && playerSprite.CanInteract) {
        openModal();
    }
});