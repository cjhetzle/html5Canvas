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

function eraseBackground() {
   context.clearRect(0,0,canvas.width,canvas.height);
}