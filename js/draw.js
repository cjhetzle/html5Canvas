var canvas = document.getElementById('canvas'),
context = canvas.getContext('2d');

function drawBackground() {
   var STEP_Y = 12,
   TOP_MARGIN = STEP_Y * 4,
   LEFT_MARGIN = STEP_Y * 3,
   i = context.canvas.height;

   // horizontal lines

   context.strokeStyle = 'lightgray';
   context.lineWidth = 0.5;

   while (i>TOP_MARGIN) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
      i -= STEP_Y;
   }

   // vertical line

   context.strokeStyle = 'rgba(100,0,0,0.3)';
   context.lineWidth = 1;
   context.beginPath();
   context.moveTo(LEFT_MARGIN,0);
   context.lineTo(LEFT_MARGIN,context.canvas.height);
   context.stroke();
}

function drawDisc(disc) {
      gradient = context.createRadialGradient(disc.x, disc.y, 0,
                        disc.x, disc.y, disc.radius);
      gradient.addColorStop(0.3, disc.innerColor);
      gradient.addColorStop(0.5, disc.middleColor);
      gradient.addColorStop(1.0, disc.outerColor);
      context.save();
      context.beginPath();
      context.arc(disc.x, disc.y, disc.radius, 0, Math.PI*2, false);
      context.fillStyle = gradient;
      context.strokeStyle = disc.strokeStyle;
      context.fill();
      context.stroke();
      context.restore();
}

function eraseBackground() {
   context.clearRect(0,0,canvas.width,canvas.height);
}

function drawDiscBackground(disc) {
   context.save();
   context.beginPath();
   context.arc(disc.lastX, disc.lastY,
              disc.radius+5, 0, Math.PI*2, false);

    context.clip();

    eraseBackground();
    drawBackground();

    context.restore();
}

