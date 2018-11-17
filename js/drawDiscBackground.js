function drawDiscBackground(disc) {
   context.save();
    context.beginPath();
    context.arc(disc.lastX, disc.lastY,
            disc.radius+1, 0, Math.PI*2, false);

    context.clip();

    eraseBackground();
    drawBackground();

    context.restore();
}